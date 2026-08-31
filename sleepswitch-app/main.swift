// SleepSwitch — menu bar toggle for "running with closed screen" (pmset -a disablesleep 0|1)
// Left click toggles (Touch ID), right click opens the menu.

import Cocoa
import LocalAuthentication

// MARK: - shell helpers

@discardableResult
func run(_ path: String, _ args: [String]) -> (status: Int32, out: String) {
    let task = Process()
    task.executableURL = URL(fileURLWithPath: path)
    task.arguments = args
    let pipe = Pipe()
    task.standardOutput = pipe
    task.standardError = pipe
    do { try task.run() } catch { return (-1, "\(error)") }
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    task.waitUntilExit()
    return (task.terminationStatus, String(data: data, encoding: .utf8) ?? "")
}

/// Runs a command through the system authentication dialog (asks for a password).
func runWithAuthDialog(_ command: String) -> (ok: Bool, message: String) {
    let escaped = command.replacingOccurrences(of: "\\", with: "\\\\")
                         .replacingOccurrences(of: "\"", with: "\\\"")
    var err: NSDictionary?
    NSAppleScript(source: "do shell script \"\(escaped)\" with administrator privileges")?
        .executeAndReturnError(&err)
    if let err = err {
        let code = err[NSAppleScript.errorNumber] as? Int ?? 0
        if code == -128 { return (false, "") }          // user cancelled
        return (false, err[NSAppleScript.errorMessage] as? String ?? "unknown error")
    }
    return (true, "")
}

// MARK: - sudo

enum Sudo {
    static let rulePath = "/etc/sudoers.d/pmset-disablesleep"

    /// True when the sudoers rule is in place, i.e. pmset runs without a password.
    static var passwordless: Bool {
        run("/usr/bin/sudo", ["-n", "-l", "/usr/bin/pmset", "-a", "disablesleep", "0"]).status == 0
    }
}

// MARK: - Touch ID

enum Biometrics {
    /// True when the machine can authenticate the owner at all (Touch ID, Watch or password).
    static var available: Bool {
        var e: NSError?
        return LAContext().canEvaluatePolicy(.deviceOwnerAuthentication, error: &e)
    }

    /// True when an actual biometric sensor is usable right now (lid open on a laptop).
    static var biometryReady: Bool {
        var e: NSError?
        return LAContext().canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &e)
    }

    /// Touch ID, with Apple Watch and the login password as built-in fallbacks.
    static func authenticate(reason: String, completion: @escaping (_ ok: Bool, _ message: String) -> Void) {
        let ctx = LAContext()
        var e: NSError?
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthentication, error: &e) else {
            completion(true, "")                        // nothing to authenticate against: don't block
            return
        }
        ctx.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { ok, err in
            DispatchQueue.main.async {
                if ok { completion(true, ""); return }
                let code = (err as? LAError)?.code
                if code == .userCancel || code == .appCancel || code == .systemCancel {
                    completion(false, "")               // silent, the user said no
                } else {
                    completion(false, err?.localizedDescription ?? "Authentication failed")
                }
            }
        }
    }
}

// MARK: - pmset state

enum Sleep {
    static var isDisabled: Bool {
        let out = run("/usr/bin/pmset", ["-g"]).out
        for line in out.split(separator: "\n") where line.contains("SleepDisabled") {
            return line.contains("1")
        }
        return false
    }

    /// Sets the flag via passwordless sudo; falls back to the password dialog.
    static func set(_ disabled: Bool) -> (ok: Bool, message: String) {
        let value = disabled ? "1" : "0"
        let sudo = run("/usr/bin/sudo", ["-n", "/usr/bin/pmset", "-a", "disablesleep", value])
        if sudo.status == 0 { return (true, "") }
        return runWithAuthDialog("/usr/bin/pmset -a disablesleep \(value)")
    }
}

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate {

    private let touchIDKey = "requireTouchID"
    private var statusItem: NSStatusItem!
    private var timer: Timer?
    private var busy = false

    private var requireTouchID: Bool {
        get { UserDefaults.standard.object(forKey: touchIDKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: touchIDKey) }
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.target = self
            button.action = #selector(clicked(_:))
            button.sendAction(on: [.leftMouseUp, .rightMouseUp])
        }
        refresh()
        // Pick up changes made elsewhere (Terminal, other tools).
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
            self?.refresh()
        }
    }

    private func refresh() {
        guard !busy, let button = statusItem.button else { return }
        let disabled = Sleep.isDisabled
        let name = disabled ? "cup.and.saucer.fill" : "moon.zzz.fill"
        let label = disabled ? "running with closed screen ON" : "running with closed screen OFF"
        let image = NSImage(systemSymbolName: name, accessibilityDescription: label)
        if disabled {
            // Red = the machine stays awake with the lid closed. Leaving template
            // mode is what allows a colour in the menu bar at all.
            let red = NSImage.SymbolConfiguration(hierarchicalColor: .systemRed)
            button.image = image?.withSymbolConfiguration(red)
            button.image?.isTemplate = false
        } else {
            button.image = image
            button.image?.isTemplate = true
        }
        button.toolTip = "SleepSwitch — \(label)"
    }

    @objc private func clicked(_ sender: NSStatusBarButton) {
        let isRight = NSApp.currentEvent?.type == .rightMouseUp
            || NSApp.currentEvent?.modifierFlags.contains(.control) == true
        if isRight { showMenu() } else { toggle() }
    }

    @objc private func toggle() {
        guard !busy else { return }
        let target = !Sleep.isDisabled
        let reason = target ? "switch running with closed screen ON" : "switch running with closed screen OFF"

        // Touch ID only guards the passwordless path — otherwise the password
        // dialog is the authentication and asking twice would be silly.
        guard requireTouchID, Sudo.passwordless, Biometrics.available else {
            apply(target)
            return
        }
        busy = true
        Biometrics.authenticate(reason: reason) { [weak self] ok, message in
            guard let self = self else { return }
            self.busy = false
            guard ok else {
                if !message.isEmpty { self.alert(message) }
                return
            }
            self.apply(target)
        }
    }

    private func apply(_ target: Bool) {
        busy = true
        let result = Sleep.set(target)
        busy = false
        if !result.ok && !result.message.isEmpty { alert(result.message) }
        refresh()
    }

    private func showMenu() {
        let disabled = Sleep.isDisabled
        let passwordless = Sudo.passwordless
        let menu = NSMenu()

        let state = NSMenuItem(title: disabled ? "Running with closed screen: ON" : "Running with closed screen: OFF",
                               action: nil, keyEquivalent: "")
        state.isEnabled = false
        menu.addItem(state)
        menu.addItem(.separator())

        let toggleItem = NSMenuItem(title: disabled ? "Switch OFF" : "Switch ON",
                                    action: #selector(toggle), keyEquivalent: "")
        toggleItem.target = self
        menu.addItem(toggleItem)

        menu.addItem(.separator())

        if passwordless {
            let tid = NSMenuItem(title: "Confirm with Touch ID",
                                 action: #selector(toggleTouchID), keyEquivalent: "")
            tid.target = self
            tid.state = requireTouchID ? .on : .off
            if !Biometrics.available {
                tid.isEnabled = false
                tid.title = "Touch ID not available"
            } else if requireTouchID && !Biometrics.biometryReady {
                tid.title = "Confirm with Touch ID (sensor closed — password)"
            }
            menu.addItem(tid)

            let info = NSMenuItem(title: "Passwordless: enabled", action: nil, keyEquivalent: "")
            info.isEnabled = false
            menu.addItem(info)
        } else {
            let sudoItem = NSMenuItem(title: "Set up Touch ID / passwordless…",
                                      action: #selector(installSudoers), keyEquivalent: "")
            sudoItem.target = self
            menu.addItem(sudoItem)
        }

        let quit = NSMenuItem(title: "Quit", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        menu.addItem(.separator())
        menu.addItem(quit)

        statusItem.menu = menu
        statusItem.button?.performClick(nil)
        statusItem.menu = nil
    }

    @objc private func toggleTouchID() {
        requireTouchID = !requireTouchID
    }

    /// Installs a tightly scoped sudoers rule so the toggle stops asking for a password.
    @objc private func installSudoers() {
        let user = NSUserName()
        let rule = "\(user) ALL=(root) NOPASSWD: /usr/bin/pmset -a disablesleep 0, /usr/bin/pmset -a disablesleep 1"
        let tmp = "/tmp/pmset-disablesleep.sudoers"
        do {
            try (rule + "\n").write(toFile: tmp, atomically: true, encoding: .utf8)
        } catch {
            alert("Could not write the rule: \(error.localizedDescription)")
            return
        }
        let cmd = "/usr/sbin/visudo -c -f \(tmp) && /bin/cp \(tmp) \(Sudo.rulePath) && /bin/chmod 440 \(Sudo.rulePath)"
        let result = runWithAuthDialog(cmd)
        if result.ok {
            alert("Done — SleepSwitch now switches without a password, "
                  + "confirmed by Touch ID.\n\nRule in \(Sudo.rulePath):\n\(rule)")
        } else if !result.message.isEmpty {
            alert(result.message)
        }
    }

    private func alert(_ text: String) {
        let a = NSAlert()
        a.messageText = "SleepSwitch"
        a.informativeText = text
        a.runModal()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
