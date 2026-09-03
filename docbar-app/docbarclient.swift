// DocBarClient — shared by every one of our menu bar tools.
// Instead of claiming a menu bar slot of its own, an app publishes its menu as JSON
// into a common folder; DocBar draws it and posts the click back. The menu bar only
// ever carries one icon, which matters on a notched display where slots run out.

import Foundation

struct DocBarItem: Codable {
    var id: String
    var title: String
    var state: Bool?          // shows a checkmark when true

    init(_ id: String, _ title: String, state: Bool? = nil) {
        self.id = id
        self.title = title
        self.state = state
    }
}

struct DocBarMenu: Codable {
    var id: String
    var name: String
    var symbol: String        // SF Symbol name
    var status: String?       // one short line under the app name
    var rank: Int?            // panel order; lower comes first, unranked tools follow
    var primary: String?      // item fired by clicking the app's own row
    var alert: Bool?          // turns the DocBar icon red while this tool needs to be seen
    var toggle: Bool?         // shows an ON/OFF pill on the app's row; the row flips it
    var pid: Int32
    var launchPath: String    // used to start the app again when it is not running
    var items: [DocBarItem]
}

final class DocBarClient {
    static let actionNotification = Notification.Name("de.docalvers.docbar.action")

    static var folder: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("DocBar", isDirectory: true)
            .appendingPathComponent("apps", isDirectory: true)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base
    }

    private let id: String
    private let name: String
    private let symbol: String
    private let rank: Int

    private var url: URL { DocBarClient.folder.appendingPathComponent("\(id).json") }

    /// The handler is called on the main queue with the id of the clicked item.
    init(id: String, name: String, symbol: String, rank: Int = 100, handler: @escaping (String) -> Void) {
        self.id = id
        self.name = name
        self.symbol = symbol
        self.rank = rank
        DistributedNotificationCenter.default().addObserver(
            forName: DocBarClient.actionNotification, object: id, queue: .main
        ) { note in
            guard let item = note.userInfo?["item"] as? String else { return }
            handler(item)
        }
    }

    func publish(status: String?, items: [DocBarItem], primary: String? = nil,
                 alert: Bool = false, toggle: Bool? = nil) {
        let menu = DocBarMenu(id: id, name: name, symbol: symbol, status: status, rank: rank,
                              primary: primary, alert: alert, toggle: toggle,
                              pid: ProcessInfo.processInfo.processIdentifier,
                              launchPath: Bundle.main.bundlePath, items: items)
        let enc = JSONEncoder()
        enc.outputFormatting = [.prettyPrinted]
        if let data = try? enc.encode(menu) { try? data.write(to: url, options: .atomic) }
    }

    /// Removes the entry so DocBar stops listing a tool that was quit on purpose.
    func withdraw() { try? FileManager.default.removeItem(at: url) }
}
