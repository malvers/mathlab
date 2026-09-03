// DocBar — one menu bar icon for all of Doc's own tools.
// Each tool drops a small JSON menu into ~/Library/Application Support/DocBar/apps;
// DocBar renders them in a single popover panel and posts the click back to the tool.

import Cocoa

// MARK: - Look

private enum Style {
    static let width: CGFloat = 340
    static let rowHeight: CGFloat = 30
    static let headerHeight: CGFloat = 46
    static let inset: CGFloat = 14
    static let pad: CGFloat = 8
    static let icon = "d.circle.fill"   // D as in Doc
    static let font = NSFont.systemFont(ofSize: 13)
    static let nameFont = NSFont.systemFont(ofSize: 13, weight: .semibold)
    static let subFont = NSFont.systemFont(ofSize: 11)
}

/// A row that lights up under the pointer and reports the click.
final class RowView: NSView {
    private let action: () -> Void
    private var tracking: NSTrackingArea?
    private let highlight = CALayer()
    let rowHeight: CGFloat
    var enabled = true

    init(height: CGFloat, action: @escaping () -> Void) {
        self.rowHeight = height
        self.action = action
        super.init(frame: NSRect(x: 0, y: 0, width: Style.width, height: height))
        wantsLayer = true
        highlight.backgroundColor = NSColor.controlAccentColor.withAlphaComponent(0.85).cgColor
        highlight.cornerRadius = 6
        highlight.opacity = 0
        layer?.addSublayer(highlight)
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layout() {
        super.layout()
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        highlight.frame = bounds.insetBy(dx: 6, dy: 2)
        CATransaction.commit()
    }

    override func updateTrackingAreas() {
        super.updateTrackingAreas()
        if let t = tracking { removeTrackingArea(t) }
        let t = NSTrackingArea(rect: bounds, options: [.mouseEnteredAndExited, .activeAlways], owner: self)
        addTrackingArea(t)
        tracking = t
    }

    override func mouseEntered(with event: NSEvent) { if enabled { highlight.opacity = 1 } }
    override func mouseExited(with event: NSEvent) { highlight.opacity = 0 }
    override func mouseUp(with event: NSEvent) { if enabled { action() } }
}

// MARK: - Panel contents

final class PanelController: NSViewController {
    var onPick: ((DocBarMenu, DocBarItem) -> Void)?
    var onLaunch: ((DocBarMenu) -> Void)?
    var onQuit: (() -> Void)?

    private let stack = NSStackView()
    /// Sections the user folded away; remembered between openings.
    private var collapsed: Set<String> {
        get { Set(UserDefaults.standard.stringArray(forKey: "collapsed") ?? []) }
        set { UserDefaults.standard.set(Array(newValue), forKey: "collapsed") }
    }
    var onRelayout: (() -> Void)?
    /// Height the panel needs; the popover is set to exactly this before it opens.
    private(set) var contentHeight: CGFloat = 100

    override func loadView() {
        let effect = NSVisualEffectView(frame: NSRect(x: 0, y: 0, width: Style.width, height: 100))
        effect.material = .popover
        effect.blendingMode = .behindWindow
        effect.state = .active

        stack.orientation = .vertical
        stack.spacing = 0
        stack.alignment = .leading
        stack.edgeInsets = NSEdgeInsets(top: Style.pad, left: 0, bottom: Style.pad, right: 0)
        stack.translatesAutoresizingMaskIntoConstraints = false
        effect.addSubview(stack)
        // Pinned at the top and both sides, deliberately not at the bottom: the rows keep
        // their own heights, so nothing can fight over the height while the popover animates.
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: effect.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: effect.trailingAnchor),
            stack.topAnchor.constraint(equalTo: effect.topAnchor),
        ])
        view = effect
    }

    // MARK: row builders

    private func label(_ text: String, _ font: NSFont, _ color: NSColor) -> NSTextField {
        let t = NSTextField(labelWithString: text)
        t.font = font
        t.textColor = color
        t.lineBreakMode = .byTruncatingTail
        t.translatesAutoresizingMaskIntoConstraints = false
        return t
    }

    private func header(_ app: DocBarMenu, running: Bool) -> RowView {
        let row = RowView(height: Style.headerHeight) { [weak self] in
            if running {
                if let pid = app.primary { self?.onPick?(app, DocBarItem(pid, "")) }
            } else {
                self?.onLaunch?(app)
            }
        }
        row.enabled = !running || app.primary != nil

        let symbol = NSImage(systemSymbolName: app.symbol, accessibilityDescription: app.name)
            ?? NSImage(systemSymbolName: "app.dashed", accessibilityDescription: nil)!
        let icon = NSImageView(image: symbol)
        icon.symbolConfiguration = NSImage.SymbolConfiguration(pointSize: 16, weight: .regular)
        icon.contentTintColor = running ? .controlAccentColor : .tertiaryLabelColor
        icon.translatesAutoresizingMaskIntoConstraints = false

        let name = label(app.name, Style.nameFont, running ? .labelColor : .tertiaryLabelColor)
        let sub = label(running ? (app.status ?? "läuft") : "nicht aktiv — klicken zum Starten",
                        Style.subFont, .secondaryLabelColor)

        row.addSubview(icon)
        row.addSubview(name)
        row.addSubview(sub)
        NSLayoutConstraint.activate([
            icon.leadingAnchor.constraint(equalTo: row.leadingAnchor, constant: Style.inset),
            icon.centerYAnchor.constraint(equalTo: row.centerYAnchor),
            icon.widthAnchor.constraint(equalToConstant: 20),

            name.leadingAnchor.constraint(equalTo: icon.trailingAnchor, constant: 10),
            name.trailingAnchor.constraint(lessThanOrEqualTo: row.trailingAnchor, constant: -Style.inset - 26),
            name.topAnchor.constraint(equalTo: row.topAnchor, constant: 7),

            sub.leadingAnchor.constraint(equalTo: name.leadingAnchor),
            sub.trailingAnchor.constraint(lessThanOrEqualTo: row.trailingAnchor, constant: -Style.inset - 26),
            sub.topAnchor.constraint(equalTo: name.bottomAnchor, constant: 1),
        ])

        // A chevron folds the section away — WindowSets alone brings ten rows.
        let folded = collapsed.contains(app.id)
        let chevron = NSButton()
        chevron.isBordered = false
        chevron.bezelStyle = .inline
        chevron.title = ""
        chevron.image = NSImage(systemSymbolName: folded ? "chevron.forward" : "chevron.down",
                                accessibilityDescription: folded ? "aufklappen" : "zuklappen")
        chevron.contentTintColor = .secondaryLabelColor
        chevron.translatesAutoresizingMaskIntoConstraints = false
        chevron.target = self
        chevron.action = #selector(toggleSection(_:))
        chevron.identifier = NSUserInterfaceItemIdentifier(app.id)
        row.addSubview(chevron)
        NSLayoutConstraint.activate([
            chevron.trailingAnchor.constraint(equalTo: row.trailingAnchor, constant: -Style.inset),
            chevron.centerYAnchor.constraint(equalTo: row.centerYAnchor),
            chevron.widthAnchor.constraint(equalToConstant: 18),
        ])

        // An ON/OFF pill saves the tool from spelling its state out twice.
        if running, let on = app.toggle {
            // The label lives inside the pill and is centred there: a text field stretched
            // to the pill's height would draw its text along the top edge instead.
            let pill = NSView()
            pill.wantsLayer = true
            // Red where the tool also raises its alert flag, so the pill says the same
            // thing as the red D in the menu bar; plain green for a harmless switch.
            let onColor: NSColor = app.alert == true ? .systemRed : .systemGreen
            pill.layer?.backgroundColor = (on ? onColor : NSColor.tertiaryLabelColor).cgColor
            pill.layer?.cornerRadius = 8
            pill.translatesAutoresizingMaskIntoConstraints = false

            let text = label(on ? "ON" : "OFF", NSFont.systemFont(ofSize: 10, weight: .bold),
                             on ? .white : .secondaryLabelColor)
            text.alignment = .center
            pill.addSubview(text)
            row.addSubview(pill)
            NSLayoutConstraint.activate([
                text.centerXAnchor.constraint(equalTo: pill.centerXAnchor),
                text.centerYAnchor.constraint(equalTo: pill.centerYAnchor),

                pill.trailingAnchor.constraint(equalTo: chevron.leadingAnchor, constant: -8),
                pill.centerYAnchor.constraint(equalTo: chevron.centerYAnchor),
                pill.widthAnchor.constraint(equalToConstant: 38),
                pill.heightAnchor.constraint(equalToConstant: 16),
            ])
        }
        return row
    }

    private func plainRow(_ title: String, color: NSColor, indent: CGFloat,
                          check: Bool, action: @escaping () -> Void) -> RowView {
        let row = RowView(height: Style.rowHeight, action: action)
        let t = label(title, Style.font, color)
        row.addSubview(t)
        NSLayoutConstraint.activate([
            t.leadingAnchor.constraint(equalTo: row.leadingAnchor, constant: indent),
            t.centerYAnchor.constraint(equalTo: row.centerYAnchor),
            t.trailingAnchor.constraint(lessThanOrEqualTo: row.trailingAnchor, constant: -34),
        ])
        if check {
            let mark = NSImageView(image: NSImage(systemSymbolName: "checkmark", accessibilityDescription: nil)!)
            mark.contentTintColor = .secondaryLabelColor
            mark.translatesAutoresizingMaskIntoConstraints = false
            row.addSubview(mark)
            NSLayoutConstraint.activate([
                mark.trailingAnchor.constraint(equalTo: row.trailingAnchor, constant: -Style.inset),
                mark.centerYAnchor.constraint(equalTo: row.centerYAnchor),
            ])
        }
        return row
    }

    @objc private func toggleSection(_ sender: NSButton) {
        guard let id = sender.identifier?.rawValue else { return }
        var set = collapsed
        if set.contains(id) { set.remove(id) } else { set.insert(id) }
        collapsed = set
        onRelayout?()
    }

    private func separator() -> NSView {
        let strip = NSView()
        let line = NSView()
        line.wantsLayer = true
        line.layer?.backgroundColor = NSColor.separatorColor.cgColor
        line.translatesAutoresizingMaskIntoConstraints = false
        strip.addSubview(line)
        NSLayoutConstraint.activate([
            line.leadingAnchor.constraint(equalTo: strip.leadingAnchor, constant: Style.inset),
            line.trailingAnchor.constraint(equalTo: strip.trailingAnchor, constant: -Style.inset),
            line.centerYAnchor.constraint(equalTo: strip.centerYAnchor),
            line.heightAnchor.constraint(equalToConstant: 1),
        ])
        return strip
    }

    /// Rebuilds the whole panel and lays it out top down; cheap enough to do on every opening.
    func show(apps: [DocBarMenu], running: (DocBarMenu) -> Bool) {
        stack.arrangedSubviews.forEach { $0.removeFromSuperview() }

        var plan: [(NSView, CGFloat)] = []

        if apps.isEmpty {
            let r = plainRow("Keine Werkzeuge gemeldet", color: .secondaryLabelColor,
                             indent: Style.inset, check: false) {}
            r.enabled = false
            plan.append((r, Style.rowHeight))
        }

        for (i, app) in apps.enumerated() {
            if i > 0 { plan.append((separator(), 9)) }
            let live = running(app)
            plan.append((header(app, running: live), Style.headerHeight))
            if live && !collapsed.contains(app.id) {
                for item in app.items {
                    let r = plainRow(item.title, color: .labelColor, indent: Style.inset + 30,
                                     check: item.state == true) { [weak self] in self?.onPick?(app, item) }
                    plan.append((r, Style.rowHeight))
                }
            }
        }

        plan.append((separator(), 9))
        plan.append((plainRow("DocBar beenden", color: .labelColor,
                              indent: Style.inset + 30, check: false) { [weak self] in self?.onQuit?() },
                     Style.rowHeight))

        contentHeight = plan.reduce(Style.pad * 2) { $0 + $1.1 }
        for (v, h) in plan {
            v.translatesAutoresizingMaskIntoConstraints = false
            stack.addArrangedSubview(v)
            NSLayoutConstraint.activate([
                v.heightAnchor.constraint(equalToConstant: h),
                v.widthAnchor.constraint(equalTo: stack.widthAnchor),
            ])
        }
        preferredContentSize = NSSize(width: Style.width, height: contentHeight)
    }
}

// MARK: - App

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    private let popover = NSPopover()
    private let panel = PanelController()

    func applicationDidFinishLaunching(_ note: Notification) {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        if let button = statusItem.button {
            button.image = NSImage(systemSymbolName: Style.icon, accessibilityDescription: "DocBar")
            button.image?.isTemplate = true
            button.action = #selector(toggle)
            button.target = self
        }

        popover.behavior = .transient
        popover.contentViewController = panel
        panel.onPick = { [weak self] app, item in
            DistributedNotificationCenter.default().postNotificationName(
                DocBarClient.actionNotification, object: app.id,
                userInfo: ["item": item.id], deliverImmediately: true)
            self?.popover.performClose(nil)
        }
        panel.onLaunch = { [weak self] app in
            NSWorkspace.shared.openApplication(at: URL(fileURLWithPath: app.launchPath),
                                               configuration: NSWorkspace.OpenConfiguration())
            self?.popover.performClose(nil)
        }
        panel.onQuit = { NSApp.terminate(nil) }
        panel.onRelayout = { [weak self] in self?.rebuildPanel() }

        // Lets the panel be opened without the mouse — handy for a hotkey later.
        DistributedNotificationCenter.default().addObserver(
            forName: Notification.Name("de.docalvers.docbar.open"), object: nil, queue: .main
        ) { [weak self] _ in self?.toggle() }

        refreshIcon(loadApps())
        Timer.scheduledTimer(withTimeInterval: 4, repeats: true) { [weak self] _ in
            guard let self = self, !self.popover.isShown else { return }
            self.refreshIcon(self.loadApps())
        }
    }

    /// Reads every published menu; entries whose file is stale are still listed so the
    /// tool can be started again from the panel.
    private func loadApps() -> [DocBarMenu] {
        let fm = FileManager.default
        let urls = (try? fm.contentsOfDirectory(at: DocBarClient.folder,
                                                includingPropertiesForKeys: nil)) ?? []
        return urls
            .filter { $0.pathExtension == "json" }
            .compactMap { try? JSONDecoder().decode(DocBarMenu.self, from: Data(contentsOf: $0)) }
            .sorted {
                let a = $0.rank ?? 100, b = $1.rank ?? 100
                if a != b { return a < b }
                return $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending
            }
    }

    private func isRunning(_ app: DocBarMenu) -> Bool { kill(app.pid, 0) == 0 || errno == EPERM }

    /// Red icon whenever a running tool has raised its alert flag.
    private func refreshIcon(_ apps: [DocBarMenu]) {
        guard let button = statusItem.button else { return }
        let alerting = apps.contains { $0.alert == true && isRunning($0) }
        let base = NSImage(systemSymbolName: Style.icon, accessibilityDescription: "DocBar")
        // Bigger than the system default: the D is the one icon of ours left up there.
        let size = NSImage.SymbolConfiguration(pointSize: 20, weight: .semibold)
        // Grown by a point at the top, which pushes the glyph that far down in the bar.
        func loweredByOne(_ image: NSImage?) -> NSImage? {
            guard let image = image else { return nil }
            let out = NSImage(size: NSSize(width: image.size.width, height: image.size.height + 1))
            out.lockFocus()
            image.draw(in: NSRect(origin: .zero, size: image.size))
            out.unlockFocus()
            return out
        }

        if alerting {
            // Palette instead of hierarchical: hierarchical punches the D out of the disc,
            // so the wallpaper shows through it instead of white.
            button.image = loweredByOne(base?.withSymbolConfiguration(
                size.applying(NSImage.SymbolConfiguration(paletteColors: [.white, .systemRed]))))
            button.image?.isTemplate = false
        } else {
            button.image = loweredByOne(base?.withSymbolConfiguration(size))
            button.image?.isTemplate = true
        }
    }

    /// Redraws the panel and resizes the popover to what the panel now needs.
    private func rebuildPanel() {
        let apps = loadApps()
        refreshIcon(apps)
        panel.show(apps: apps, running: isRunning)
        // Explicit, so the popover never keeps a height from an earlier opening.
        popover.contentSize = NSSize(width: Style.width, height: panel.contentHeight)
    }

    @objc private func toggle() {
        if popover.isShown { popover.performClose(nil); return }
        guard let button = statusItem.button else { return }
        rebuildPanel()
        // The anchor has to stay inside the button — a rect outside its bounds makes
        // NSPopover refuse to open at all. So the panel is nudged afterwards instead:
        // centred under the icon it would cover the window to its left, and DocBar is
        // the leftmost status item.
        popover.show(relativeTo: button.bounds, of: button, preferredEdge: .maxY)
        if let w = popover.contentViewController?.view.window {
            w.setFrameOrigin(NSPoint(x: w.frame.origin.x + 40, y: w.frame.origin.y))
        }
        popover.contentViewController?.view.window?.makeKey()
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.accessory)
app.run()
