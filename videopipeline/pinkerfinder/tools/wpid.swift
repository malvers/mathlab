import Cocoa
let list = CGWindowListCopyWindowInfo([.excludeDesktopElements], kCGNullWindowID) as! [[String: Any]]
for w in list {
    let pid = w["kCGWindowOwnerPID"] as? Int ?? 0
    let owner = w["kCGWindowOwnerName"] as? String ?? ""
    guard owner == "Pinker-Finder" || owner == "Finder" else { continue }
    let id = w["kCGWindowNumber"] as? Int ?? 0
    let b = w["kCGWindowBounds"] as? [String: Any] ?? [:]
    let layer = w["kCGWindowLayer"] as? Int ?? 0
    let name = w["kCGWindowName"] as? String ?? ""
    let on = w["kCGWindowIsOnscreen"] as? Bool ?? false
    let alpha = w["kCGWindowAlpha"] as? Double ?? -1
    print("\(id)\tpid=\(pid)\t\(owner)\tL\(layer)\ton=\(on)\ta=\(alpha)\t'\(name)'\t\(b["X"]!),\(b["Y"]!) \(b["Width"]!)x\(b["Height"]!)")
}
