// Meine Keychain — our passwords in one place (Doc, 17.09.2026: "Bau mir bitte hier 'meine Keychain' für unsere pwds.
// Das ich ändern und schauen kann."). Every password lives in the macOS keychain. Where it also works somewhere else - a
// Supabase secret - a change goes live at once, and a dot says whether the live copy matches the keychain: Supabase only
// lists a SHA-256 digest of each secret, which is compared with the digest of the keychain value, so nothing secret
// leaves the Mac for the check. Showing, copying and changing ask for Touch ID.
// Keychain access goes through /usr/bin/security, which the entries were created with - macOS asks no extra questions,
// and the scripts that read them (docpad/tools/pack_web.mjs, testkorrektur) keep working.

import Cocoa
import CryptoKit
import LocalAuthentication

let PROJECT = "fyfhxzyymmurlaenmzse"
// --snapshot <png>: draws the window off screen into a picture and quits, without DocBar - to check the look with the
// lid closed. Passwords stay hidden; it only shows what the dots and buttons say.
let SNAPSHOT: String? = CommandLine.arguments.firstIndex(of: "--snapshot").flatMap {
    $0 + 1 < CommandLine.arguments.count ? CommandLine.arguments[$0 + 1] : nil
}
let SUPABASE = "/usr/local/bin/supabase"

// MARK: - the passwords

struct Entry {
    let id: String
    let name: String
    let note: String
    let service: String
    let account: String?      // nil: the account of the item that is already there
    let label: String
    let secret: String?       // the Supabase secret it has to match; nil = keychain only
    let minLength: Int
    let warning: String       // said before a change
}

let ENTRIES: [Entry] = [
    Entry(id: "docpad", name: "DOCPAD", note: "docalvers.de/docpad · Supabase DOCPAD_PASSWORD",
          service: "docpad-web", account: nil, label: "DOCPAD web (docalvers.de/docpad)", secret: "DOCPAD_PASSWORD",
          minLength: 12,
          warning: "Neue Geräte brauchen danach das neue Passwort. Geräte, die DOCPAD schon geöffnet haben, laufen weiter."),
    Entry(id: "sus", name: "Solita SuS", note: "„Frag Solita“ für Schülerinnen und Schüler · Supabase SUS_PASSWORD",
          service: "solita-sus", account: "sus", label: "Solita: Passwort für SuS (Frag Solita im Deck)", secret: "SUS_PASSWORD",
          minLength: 8,
          warning: "Geräte, die sich das alte Passwort gemerkt haben, müssen das neue eingeben."),
    Entry(id: "solita", name: "Solita Doc", note: "solita.html, DocPad-Solita, Decks · Supabase LABAI_PASSWORD",
          service: "solita-doc", account: "doc", label: "Solita: Docs Passwort (LABAI_PASSWORD)", secret: "LABAI_PASSWORD",
          minLength: 8,
          warning: "Alle deine Geräte fragen danach für Solita das neue Passwort ab."),
    Entry(id: "pdf", name: "PDF Eingangstest 11", note: "verschlüsselte Test-PDFs · nur Schlüsselbund",
          service: "testkorrektur-pdf", account: "eingangstest-kl11", label: "Testkorrektur: PDF-Passwort Eingangstest Kl. 11",
          secret: nil, minLength: 8,
          warning: "Gilt nur für künftige PDFs. Verschickte PDFs behalten ihr altes Passwort."),
    Entry(id: "imap", name: "Mail info@docalvers.de", note: "Abruf per IMAP · nur Schlüsselbund",
          service: "docalvers-imap", account: nil, label: "docalvers-imap", secret: nil, minLength: 8,
          warning: "Ändert nur die hier gespeicherte Kopie. Beim Mail-Anbieter änderst du das Passwort dort."),
]

// MARK: - shell

@discardableResult
func run(_ path: String, _ args: [String]) -> (status: Int32, out: String, err: String) {
    let task = Process()
    task.executableURL = URL(fileURLWithPath: path)
    task.arguments = args
    let out = Pipe(), err = Pipe()
    task.standardOutput = out
    task.standardError = err
    do { try task.run() } catch { return (-1, "", "\(error)") }
    var errData = Data()
    let group = DispatchGroup()
    group.enter()
    DispatchQueue.global().async { errData = err.fileHandleForReading.readDataToEndOfFile(); group.leave() }
    let outData = out.fileHandleForReading.readDataToEndOfFile()
    group.wait()
    task.waitUntilExit()
    return (task.terminationStatus, String(data: outData, encoding: .utf8) ?? "", String(data: errData, encoding: .utf8) ?? "")
}

func sha256(_ s: String) -> String {
    SHA256.hash(data: Data(s.utf8)).map { String(format: "%02x", $0) }.joined()
}

/// The last readable line of a tool's error output, without its spinner and colour codes.
func lastLine(_ text: String) -> String {
    let clean = text.replacingOccurrences(of: "\u{1B}\\[[0-9;?]*[A-Za-z]", with: "", options: .regularExpression)
    return clean.split(whereSeparator: \.isNewline).map { $0.trimmingCharacters(in: .whitespaces) }
        .last(where: { !$0.isEmpty }) ?? "unbekannter Fehler"
}

enum Keychain {
    static func account(of e: Entry) -> String? {
        if let a = e.account { return a }
        let out = run("/usr/bin/security", ["find-generic-password", "-s", e.service]).out
        guard let r = out.range(of: "\"acct\"<blob>=\"") else { return nil }
        let rest = out[r.upperBound...]
        guard let end = rest.firstIndex(of: "\"") else { return nil }
        return String(rest[..<end])
    }

    static func read(_ e: Entry) -> String? {
        var args = ["find-generic-password", "-s", e.service, "-w"]
        if let a = e.account { args += ["-a", a] }
        let r = run("/usr/bin/security", args)
        guard r.status == 0 else { return nil }
        let v = r.out.trimmingCharacters(in: .newlines)
        return v.isEmpty ? nil : v
    }

    /// -U replaces an existing item and keeps its access list, so the scripts that read it are not asked again.
    static func write(_ e: Entry, _ value: String) -> Bool {
        let acct = account(of: e) ?? e.id
        let r = run("/usr/bin/security", ["add-generic-password", "-U", "-s", e.service, "-a", acct, "-l", e.label, "-w", value])
        return r.status == 0 && read(e) == value
    }
}

enum Supa {
    /// Secret name → SHA-256 digest of its live value; nil when Supabase could not be asked (offline, not logged in).
    static func digests() -> [String: String]? {
        let r = run(SUPABASE, ["secrets", "list", "--project-ref", PROJECT])
        guard r.status == 0 else { return nil }
        var d: [String: String] = [:]
        let re = try! NSRegularExpression(pattern: "([A-Z0-9_]+)\\s*\\|\\s*([0-9a-f]{64})")
        let ns = r.out as NSString
        for m in re.matches(in: r.out, range: NSRange(location: 0, length: ns.length)) {
            d[ns.substring(with: m.range(at: 1))] = ns.substring(with: m.range(at: 2))
        }
        return d.isEmpty ? nil : d
    }

    static func set(_ name: String, _ value: String) -> (ok: Bool, message: String) {
        let r = run(SUPABASE, ["secrets", "set", "\(name)=\(value)", "--project-ref", PROJECT])
        return (r.status == 0, r.status == 0 ? "" : lastLine(r.err + "\n" + r.out))
    }
}

// MARK: - state

enum Live { case checking, match, differs, missingLive, offline, localOnly }

struct State {
    var inKeychain = false
    var live = Live.checking
    var note = ""             // what happened last, shown under the entry
}

// MARK: - Touch ID

final class Gate {
    private var until = Date.distantPast

    /// Touch ID (Watch or login password as fallbacks); one confirmation holds for a minute.
    func open(_ reason: String, _ then: @escaping () -> Void) {
        if Date() < until { then(); return }
        let ctx = LAContext()
        var e: NSError?
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthentication, error: &e) else { return }
        ctx.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { ok, _ in
            DispatchQueue.main.async {
                guard ok else { return }
                self.until = Date().addingTimeInterval(60)
                then()
            }
        }
    }
}

// MARK: - look

enum Look {
    static let bg = NSColor(red: 14 / 255, green: 36 / 255, blue: 78 / 255, alpha: 1)      // dark blue, never black
    static let card = NSColor(red: 26 / 255, green: 53 / 255, blue: 102 / 255, alpha: 1)
    static let text = NSColor(red: 234 / 255, green: 240 / 255, blue: 255 / 255, alpha: 1)
    static let muted = NSColor(red: 159 / 255, green: 176 / 255, blue: 208 / 255, alpha: 1)
    static let green = NSColor(red: 121 / 255, green: 158 / 255, blue: 49 / 255, alpha: 1)    // φ
    static let orange = NSColor(red: 245 / 255, green: 194 / 255, blue: 66 / 255, alpha: 1)   // λ
    static let red = NSColor(red: 176 / 255, green: 36 / 255, blue: 24 / 255, alpha: 1)      // Υ
    static let grey = NSColor(red: 126 / 255, green: 143 / 255, blue: 181 / 255, alpha: 1)

    static func orbitron(_ size: CGFloat) -> NSFont {
        NSFont(name: "Orbitron-Bold", size: size) ?? .boldSystemFont(ofSize: size)
    }

    static func label(_ s: String, _ font: NSFont, _ color: NSColor) -> NSTextField {
        let l = NSTextField(labelWithString: s)
        l.font = font
        l.textColor = color
        l.lineBreakMode = .byTruncatingTail
        return l
    }
}

// MARK: - one card per password

final class Card: NSView {
    let entry: Entry
    private let dot = NSView()
    private let value = Look.label("••••••••••••", .monospacedSystemFont(ofSize: 13, weight: .regular), Look.text)
    private let status = Look.label("", .systemFont(ofSize: 11), Look.muted)
    private let buttons = NSStackView()
    private var hideTimer: Timer?
    var act: ((String) -> Void)?

    init(_ entry: Entry) {
        self.entry = entry
        super.init(frame: .zero)
        wantsLayer = true
        layer?.backgroundColor = Look.card.cgColor
        layer?.cornerRadius = 10

        dot.wantsLayer = true
        dot.layer?.cornerRadius = 6
        let name = Look.label(entry.name, Look.orbitron(14), Look.text)
        let note = Look.label(entry.note, .systemFont(ofSize: 11), Look.muted)
        value.isSelectable = true
        buttons.orientation = .horizontal
        buttons.spacing = 6

        let top = NSStackView(views: [dot, name])
        top.orientation = .horizontal
        top.spacing = 8
        let col = NSStackView(views: [top, note, value, status, buttons])
        col.orientation = .vertical
        col.alignment = .leading
        col.spacing = 5
        col.translatesAutoresizingMaskIntoConstraints = false
        addSubview(col)
        NSLayoutConstraint.activate([
            dot.widthAnchor.constraint(equalToConstant: 12), dot.heightAnchor.constraint(equalToConstant: 12),
            col.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 14),
            col.trailingAnchor.constraint(lessThanOrEqualTo: trailingAnchor, constant: -14),
            col.topAnchor.constraint(equalTo: topAnchor, constant: 12),
            col.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -12),
        ])
    }

    required init?(coder: NSCoder) { fatalError() }

    func show(_ s: State, susUntil: String?) {
        let (color, text): (NSColor, String) = {
            switch s.live {
            case .checking: return (Look.grey, "prüfe …")
            case .localOnly: return (s.inKeychain ? Look.grey : Look.red, s.inKeychain ? "nur im Schlüsselbund" : "fehlt im Schlüsselbund")
            case .offline: return (Look.grey, "Supabase gerade nicht erreichbar")
            case .missingLive: return (Look.red, "bei Supabase nicht gesetzt")
            case .match: return (Look.green, "live bei Supabase – stimmt")
            case .differs: return (s.inKeychain ? Look.orange : Look.red,
                                   s.inKeychain ? "Supabase hat ein anderes Passwort" : "fehlt im Schlüsselbund – live gesetzt")
            }
        }()
        dot.layer?.backgroundColor = color.cgColor
        if hideTimer?.isValid != true { value.stringValue = s.inKeychain ? "••••••••••••" : "—" }
        var line = text
        if entry.id == "sus", let u = susUntil { line += " · " + u }
        if !s.note.isEmpty { line += " · " + s.note }
        status.stringValue = line

        buttons.arrangedSubviews.forEach { $0.removeFromSuperview() }
        if s.inKeychain {
            add("Zeigen", "show")
            add("Kopieren", "copy")
            add("Ändern", "change")
            if s.live == .differs || s.live == .missingLive { add("Live setzen", "push") }
        } else {
            add("Eintragen", "change")
        }
        if entry.id == "sus" {
            add("Heute freigeben", "open-today")
            add("Sperren", "lock")
        }
    }

    private func add(_ title: String, _ id: String) {
        let b = NSButton(title: title, target: self, action: #selector(tap(_:)))
        b.bezelStyle = .rounded
        b.controlSize = .small
        b.font = .systemFont(ofSize: 11)
        b.identifier = NSUserInterfaceItemIdentifier(id)
        buttons.addArrangedSubview(b)
    }

    @objc private func tap(_ b: NSButton) { act?(b.identifier?.rawValue ?? "") }

    /// Shows the password for 30 seconds, then hides it again.
    func reveal(_ text: String) {
        value.stringValue = text
        hideTimer?.invalidate()
        hideTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: false) { [weak self] t in
            t.invalidate()
            self?.value.stringValue = "••••••••••••"
        }
    }

    func flash() {
        layer?.borderColor = Look.orange.cgColor
        layer?.borderWidth = 2
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in self?.layer?.borderWidth = 0 }
    }
}

// MARK: - app

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var bar: DocBarClient?
    private var window: NSWindow!
    private var cards: [String: Card] = [:]
    private var states: [String: State] = [:]
    private let gate = Gate()
    private var refreshing = false
    private var timer: Timer?

    private var susUntil: String? {
        get { UserDefaults.standard.string(forKey: "susUntil") }
        set { UserDefaults.standard.set(newValue, forKey: "susUntil") }
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        if susUntil == nil { susUntil = "freigegeben bis Do 17.09. 24:00" }   // set by hand on 17.09.2026
        ENTRIES.forEach { states[$0.id] = State() }
        if let png = SNAPSHOT { snapshot(png); return }
        bar = DocBarClient(id: "de.docalvers.meinekeychain", name: "Meine Keychain", symbol: "key.fill", rank: 20) { [weak self] item in
            self?.handle(item)
        }
        buildWindow()
        publish()
        refresh()
        timer = Timer.scheduledTimer(withTimeInterval: 600, repeats: true) { [weak self] _ in self?.refresh() }
    }

    func applicationWillTerminate(_ note: Notification) { bar?.withdraw() }

    private func snapshot(_ png: String) {
        buildWindow()
        refresh()
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] t in
            guard let self = self, !self.refreshing, let view = self.window.contentView else { return }
            t.invalidate()
            self.render()
            view.layoutSubtreeIfNeeded()
            if let rep = view.bitmapImageRepForCachingDisplay(in: view.bounds) {
                view.cacheDisplay(in: view.bounds, to: rep)
                try? rep.representation(using: .png, properties: [:])?.write(to: URL(fileURLWithPath: png))
            }
            exit(0)
        }
    }

    private func handle(_ item: String) {
        if item == "quit" { NSApp.terminate(nil); return }
        openWindow()
        cards[item]?.flash()
    }

    // MARK: window

    private func buildWindow() {
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 560, height: 600),
                          styleMask: [.titled, .closable, .miniaturizable], backing: .buffered, defer: false)
        window.title = "Meine Keychain"
        window.isReleasedWhenClosed = false
        window.backgroundColor = Look.bg
        window.appearance = NSAppearance(named: .darkAqua)

        let title = Look.label("MEINE KEYCHAIN", Look.orbitron(18), Look.text)
        let sub = Look.label("Zeigen, Kopieren und Ändern fragen nach Touch ID. Grün: das Passwort gilt live so.",
                             .systemFont(ofSize: 11), Look.muted)
        let stack = NSStackView(views: [title, sub])
        stack.orientation = .vertical
        stack.alignment = .leading
        stack.spacing = 10
        stack.setCustomSpacing(16, after: sub)
        for e in ENTRIES {
            let c = Card(e)
            c.act = { [weak self] what in self?.act(e, what) }
            cards[e.id] = c
            stack.addArrangedSubview(c)
            c.widthAnchor.constraint(equalTo: stack.widthAnchor).isActive = true
        }
        stack.translatesAutoresizingMaskIntoConstraints = false
        let root = NSView()
        root.wantsLayer = true
        root.layer?.backgroundColor = Look.bg.cgColor     // also in --snapshot, which does not draw the window itself
        root.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: root.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: root.trailingAnchor, constant: -20),
            stack.topAnchor.constraint(equalTo: root.topAnchor, constant: 18),
            stack.bottomAnchor.constraint(equalTo: root.bottomAnchor, constant: -20),
            root.widthAnchor.constraint(equalToConstant: 560),
        ])
        window.contentView = root
        window.setContentSize(root.fittingSize)
        window.center()
        render()
    }

    private func openWindow() {
        NSApp.activate(ignoringOtherApps: true)
        window.makeKeyAndOrderFront(nil)
        refresh()
    }

    private func render() {
        for e in ENTRIES { cards[e.id]?.show(states[e.id] ?? State(), susUntil: susUntil) }
        window.setContentSize(window.contentView?.fittingSize ?? window.frame.size)
    }

    // MARK: DocBar

    private func publish() {
        var items: [DocBarItem] = []
        var differs = 0, checked = true
        for e in ENTRIES {
            let s = states[e.id] ?? State()
            let word: String
            switch s.live {
            case .checking: word = "…"; checked = false
            case .match: word = "live ✓"
            case .differs: word = s.inKeychain ? "weicht ab" : "fehlt hier"; if s.inKeychain { differs += 1 }
            case .missingLive: word = "live nicht gesetzt"; differs += 1
            case .offline: word = "offline"
            case .localOnly: word = s.inKeychain ? "nur hier" : "fehlt"
            }
            items.append(DocBarItem(e.id, "\(e.name) · \(word)", state: s.live == .match))
        }
        let missing = ENTRIES.filter { !(states[$0.id]?.inKeychain ?? false) }.count
        let status = !checked ? "\(ENTRIES.count) Passwörter · prüfe …"
            : differs > 0 ? "\(differs) weicht live ab"
            : missing > 0 ? "\(missing) von \(ENTRIES.count) fehlen im Schlüsselbund"
            : "\(ENTRIES.count) Passwörter · alles stimmt"
        bar?.publish(status: status, items: items, primary: "open", alert: differs > 0)
    }

    // MARK: checking

    func refresh() {
        guard !refreshing else { return }
        refreshing = true
        DispatchQueue.global(qos: .userInitiated).async {
            let digests = Supa.digests()
            var fresh: [String: State] = [:]
            for e in ENTRIES {
                var s = State()
                let kc = Keychain.read(e)
                s.inKeychain = kc != nil
                if let name = e.secret {
                    if let d = digests {
                        if let live = d[name] { s.live = (kc.map { sha256($0) == live } ?? false) ? .match : .differs }
                        else { s.live = .missingLive }
                    } else { s.live = .offline }
                } else { s.live = .localOnly }
                fresh[e.id] = s
            }
            DispatchQueue.main.async {
                for (id, s) in fresh {
                    let keep = self.states[id]?.note ?? ""
                    self.states[id] = s
                    self.states[id]?.note = keep
                }
                self.refreshing = false
                self.render()
                self.publish()
            }
        }
    }

    // MARK: actions

    private func act(_ e: Entry, _ what: String) {
        switch what {
        case "show":
            gate.open("\(e.name) anzeigen") { [weak self] in
                guard let v = Keychain.read(e) else { self?.note(e, "nicht lesbar"); return }
                self?.cards[e.id]?.reveal(v)
            }
        case "copy":
            gate.open("\(e.name) kopieren") { [weak self] in
                guard let v = Keychain.read(e) else { self?.note(e, "nicht lesbar"); return }
                let pb = NSPasteboard.general
                pb.clearContents()
                pb.setString(v, forType: .string)
                let stamp = pb.changeCount
                self?.note(e, "kopiert – in 60 s wieder weg")
                DispatchQueue.main.asyncAfter(deadline: .now() + 60) {
                    if pb.changeCount == stamp { pb.clearContents() }   // only if nothing else was copied since
                }
            }
        case "change":
            gate.open("\(e.name) ändern") { [weak self] in self?.change(e) }
        case "push":
            gate.open("\(e.name) live setzen") { [weak self] in
                guard let self = self, let v = Keychain.read(e), let name = e.secret else { return }
                guard self.confirm("\(e.name) live setzen?",
                                   "Supabase bekommt das Passwort aus dem Schlüsselbund.\n\n\(e.warning)") else { return }
                self.goLive(e, name, v)
            }
        case "open-today":
            gate.open("SuS-Passwort für heute freigeben") { [weak self] in self?.susWindow(open: true) }
        case "lock":
            gate.open("SuS-Passwort sperren") { [weak self] in self?.susWindow(open: false) }
        default: break
        }
    }

    private func change(_ e: Entry) {
        let fresh = !(states[e.id]?.inKeychain ?? false)
        let a = NSAlert()
        a.messageText = fresh ? "\(e.name) eintragen" : "\(e.name) ändern"
        a.informativeText = e.warning
        let one = NSSecureTextField(frame: NSRect(x: 0, y: 30, width: 300, height: 24))
        let two = NSSecureTextField(frame: NSRect(x: 0, y: 0, width: 300, height: 24))
        one.placeholderString = fresh ? "Passwort" : "neues Passwort"
        two.placeholderString = "noch einmal"
        let box = NSView(frame: NSRect(x: 0, y: 0, width: 300, height: 54))
        box.addSubview(one)
        box.addSubview(two)
        a.accessoryView = box
        a.addButton(withTitle: "Speichern")
        a.addButton(withTitle: "Abbrechen")
        a.window.initialFirstResponder = one
        NSApp.activate(ignoringOtherApps: true)
        guard a.runModal() == .alertFirstButtonReturn else { return }
        let v = one.stringValue
        guard v == two.stringValue else { tell("Die beiden Eingaben sind nicht gleich – nichts geändert."); return }
        guard v.count >= e.minLength else { tell("Mindestens \(e.minLength) Zeichen – nichts geändert."); return }
        guard v.trimmingCharacters(in: .whitespacesAndNewlines) == v else { tell("Bitte ohne Leerzeichen am Anfang oder Ende."); return }

        note(e, "speichere …")
        DispatchQueue.global(qos: .userInitiated).async {
            guard Keychain.write(e, v) else { DispatchQueue.main.async { self.note(e, "Schlüsselbund hat nicht gespeichert") }; return }
            guard let name = e.secret else { DispatchQueue.main.async { self.note(e, "gespeichert"); self.refresh() }; return }
            let live = Supa.digests()?[name]
            if live == sha256(v) { DispatchQueue.main.async { self.note(e, "gespeichert – stimmt schon live"); self.refresh() }; return }
            DispatchQueue.main.async {
                // entering a password that is not the live one: ask before changing what works right now
                if fresh, live != nil,
                   !self.confirm("Das ist nicht das Passwort, das gerade live gilt.",
                                 "Soll Supabase dieses Passwort bekommen?\n\n\(e.warning)") {
                    self.note(e, "nur im Schlüsselbund gespeichert"); self.refresh(); return
                }
                self.goLive(e, name, v)
            }
        }
    }

    private func goLive(_ e: Entry, _ name: String, _ v: String) {
        note(e, "setze live …")
        DispatchQueue.global(qos: .userInitiated).async {
            let r = Supa.set(name, v)
            let ok = r.ok && Supa.digests()?[name] == sha256(v)
            DispatchQueue.main.async {
                self.note(e, ok ? "neu – ist live" : "live setzen ging nicht: \(r.message)")
                self.refresh()
            }
        }
    }

    /// SUS_UNTIL: the student password works until the end of today, or stops right now.
    private func susWindow(open: Bool) {
        let cal = Calendar.current
        let end = open ? cal.date(byAdding: .day, value: 1, to: cal.startOfDay(for: Date()))! : Date()
        let iso = ISO8601DateFormatter().string(from: end)
        let f = DateFormatter()
        f.locale = Locale(identifier: "de_DE")
        f.dateFormat = "EE dd.MM."
        let e = ENTRIES.first { $0.id == "sus" }!
        note(e, open ? "gebe frei …" : "sperre …")
        DispatchQueue.global(qos: .userInitiated).async {
            let r = Supa.set("SUS_UNTIL", iso)
            DispatchQueue.main.async {
                if r.ok { self.susUntil = open ? "freigegeben bis \(f.string(from: Date())) 24:00" : "gesperrt" }
                self.note(e, r.ok ? (open ? "heute frei" : "gesperrt") : "ging nicht: \(r.message)")
            }
        }
    }

    // MARK: small helpers

    private func note(_ e: Entry, _ text: String) {
        states[e.id]?.note = text
        render()
    }

    private func confirm(_ title: String, _ text: String) -> Bool {
        let a = NSAlert()
        a.messageText = title
        a.informativeText = text
        a.addButton(withTitle: "Ja")
        a.addButton(withTitle: "Abbrechen")
        NSApp.activate(ignoringOtherApps: true)
        return a.runModal() == .alertFirstButtonReturn
    }

    private func tell(_ text: String) {
        let a = NSAlert()
        a.messageText = "Meine Keychain"
        a.informativeText = text
        NSApp.activate(ignoringOtherApps: true)
        a.runModal()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
