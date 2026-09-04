// Drives an app without the mouse: AXPress on toolbar controls by description, key strokes
// posted straight to the process. Usage: axdrive <pid> <step> [<step> ...]
//   steps: press:<AXDescription>   key:<keycode>[+cmd][+shift]   sleep:<seconds>
import Cocoa
import ApplicationServices
let a = CommandLine.arguments
let pid = pid_t(Int32(a[1])!)
let app = AXUIElementCreateApplication(pid)
AXUIElementSetMessagingTimeout(app, 2.0)      // fail fast instead of the 6 s default per call
func attr(_ e: AXUIElement, _ n: String) -> AnyObject? { var v: AnyObject?; AXUIElementCopyAttributeValue(e, n as CFString, &v); return v }
func str(_ e: AXUIElement, _ n: String) -> String { (attr(e, n) as? String) ?? "" }
func kids(_ e: AXUIElement) -> [AXUIElement] { (attr(e, "AXChildren") as? [AXUIElement]) ?? [] }
/// Children to descend into. Tables and outlines are the trap: SwiftUI's OutlineGroup reads a
/// folder's contents the moment AX looks at its child rows, and a facet list can carry 6000
/// rows. So a table contributes its visible rows (fallback: the first 100 rows) plus its
/// non-row children (header, scroll bars), and a row contributes its cells — never child rows.
func scope(_ e: AXUIElement, _ depth: Int) -> [AXUIElement] {
    let role = str(e, "AXRole")
    if role == "AXTable" || role == "AXOutline" || role == "AXList" {
        var rows = (attr(e, "AXVisibleRows") as? [AXUIElement]) ?? []
        if rows.isEmpty { rows = (attr(e, "AXRows") as? [AXUIElement]) ?? kids(e).filter { str($0, "AXRole") == "AXRow" } }
        let rest = kids(e).filter { str($0, "AXRole") != "AXRow" }
        return Array(rows.prefix(100)) + rest
    }
    if role == "AXRow" { return kids(e).filter { str($0, "AXRole") != "AXRow" } }
    if depth > 14 { return [] }
    return kids(e)
}
func find(_ e: AXUIElement, desc: String, depth: Int = 0) -> AXUIElement? {
    if str(e, "AXDescription") == desc || str(e, "AXTitle") == desc || str(e, "AXHelp") == desc { return e }
    for k in scope(e, depth) { if let f = find(k, desc: desc, depth: depth + 1) { return f } }
    return nil
}
func findAny(_ e: AXUIElement, text: String, depth: Int = 0) -> AXUIElement? {
    let v = (attr(e, "AXValue") as? String) ?? ""
    if str(e, "AXDescription") == text || str(e, "AXTitle") == text || v == text || str(e, "AXHelp") == text { return e }
    for k in scope(e, depth) { if let f = findAny(k, text: text, depth: depth + 1) { return f } }
    return nil
}
// the main window = the largest one: while ScreenCaptureKit records, a second (capture) window
// shows up in AXWindows and would otherwise be walked instead
func area(_ w: AXUIElement) -> Double {
    var sz = CGSize.zero
    if let sv = attr(w, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
    return Double(sz.width * sz.height)
}
guard let win = (attr(app, "AXWindows") as? [AXUIElement])?.max(by: { area($0) < area($1) }) else { print("no window"); exit(1) }
for step in a.dropFirst(2) {
    let parts = step.split(separator: ":", maxSplits: 1).map(String.init)
    switch parts[0] {
    case "sleep": Thread.sleep(forTimeInterval: Double(parts[1])!)
    case "press":
        // the toolbar first: a sidebar row called "Home" would otherwise shadow the Home button
        var el: AXUIElement? = nil
        let toolbar = kids(win).first { str($0, "AXRole") == "AXToolbar" }
        for _ in 0..<8 {
            if let tb = toolbar { el = find(tb, desc: parts[1]) }
            if el == nil { el = find(win, desc: parts[1]) ?? findAny(win, text: parts[1]) }
            if el != nil { break }; Thread.sleep(forTimeInterval: 0.25)
        }
        if let el {
            let r = AXUIElementPerformAction(el, "AXPress" as CFString)
            print("press \(parts[1]) -> \(r.rawValue)")
        } else { print("press \(parts[1]) -> not found") }
    case "key":
        let bits = parts[1].split(separator: "+").map(String.init)
        let code = CGKeyCode(UInt16(bits[0])!)
        var flags: CGEventFlags = []
        if bits.contains("cmd") { flags.insert(.maskCommand) }
        if bits.contains("shift") { flags.insert(.maskShift) }
        for down in [true, false] {
            let ev = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: down)!
            ev.flags = flags; ev.postToPid(pid)
            Thread.sleep(forTimeInterval: 0.05)
        }
        print("key \(parts[1])")
    case "activate":
        // bring the app to the front — synthetic clicks and key strokes need it there
        NSRunningApplication(processIdentifier: pid)?.activate(options: [.activateAllWindows])
        Thread.sleep(forTimeInterval: 0.4); print("activate")
    case "window":
        // window:x,y,w,h — move and size the main window (AX, no mouse)
        let v = parts[1].split(separator: ",").map { Double($0)! }
        var pt = CGPoint(x: v[0], y: v[1]), sz = CGSize(width: v[2], height: v[3])
        let pv = AXValueCreate(.cgPoint, &pt)!, sv = AXValueCreate(.cgSize, &sz)!
        AXUIElementSetAttributeValue(win, "AXPosition" as CFString, pv)
        AXUIElementSetAttributeValue(win, "AXSize" as CFString, sv)
        print("window \(parts[1])")
    case "click", "dblclick", "rclick":
        // click:<AXDescription or AXTitle or AXValue> — a real mouse click on the element's centre
        // (needs the app in front); an element without any action, e.g. a list row, works too
        let n = parts[0] == "dblclick" ? 2 : 1
        guard let el = findAny(win, text: parts[1]) else { print("\(parts[0]) \(parts[1]) -> not found"); break }
        var p = CGPoint.zero, sz = CGSize.zero
        if let pv = attr(el, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
        if let sv = attr(el, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
        let c = CGPoint(x: p.x + sz.width / 2, y: p.y + sz.height / 2)
        let right = parts[0] == "rclick"
        let move = CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: c, mouseButton: .left)!
        move.post(tap: .cghidEventTap); Thread.sleep(forTimeInterval: 0.12)
        for i in 1...n {
            let d = CGEvent(mouseEventSource: nil, mouseType: right ? .rightMouseDown : .leftMouseDown, mouseCursorPosition: c, mouseButton: right ? .right : .left)!
            let u = CGEvent(mouseEventSource: nil, mouseType: right ? .rightMouseUp : .leftMouseUp, mouseCursorPosition: c, mouseButton: right ? .right : .left)!
            d.setIntegerValueField(.mouseEventClickState, value: Int64(i)); u.setIntegerValueField(.mouseEventClickState, value: Int64(i))
            d.post(tap: .cghidEventTap); Thread.sleep(forTimeInterval: 0.06); u.post(tap: .cghidEventTap)
            if i < n { Thread.sleep(forTimeInterval: 0.12) }
        }
        print("\(parts[0]) \(parts[1]) at \(Int(c.x)),\(Int(c.y))")
    case "clickat":
        // clickat:x,y — screen coordinates, for spots that have no AX element (column header ▲)
        let v = parts[1].split(separator: ",").map { Double($0)! }
        let c = CGPoint(x: v[0], y: v[1])
        CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.12)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.06)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        print("clickat \(parts[1])")
    case "type":
        // type:<text> — typed into whatever has focus (app must be in front)
        for ch in parts[1] {
            let ev = CGEvent(keyboardEventSource: nil, virtualKey: 0, keyDown: true)!
            var u = Array(String(ch).utf16); ev.keyboardSetUnicodeString(stringLength: u.count, unicodeString: &u)
            ev.post(tap: .cghidEventTap)
            let up = CGEvent(keyboardEventSource: nil, virtualKey: 0, keyDown: false)!; up.post(tap: .cghidEventTap)
            Thread.sleep(forTimeInterval: 0.04)
        }
        print("type \(parts[1])")
    case "hidkey":
        // hidkey:<keycode>[+cmd][+shift][+alt] — a real key stroke via the HID tap (app in front)
        let bits = parts[1].split(separator: "+").map(String.init)
        let code = CGKeyCode(UInt16(bits[0])!)
        var flags: CGEventFlags = []
        if bits.contains("cmd") { flags.insert(.maskCommand) }
        if bits.contains("shift") { flags.insert(.maskShift) }
        if bits.contains("alt") { flags.insert(.maskAlternate) }
        for down in [true, false] {
            let ev = CGEvent(keyboardEventSource: nil, virtualKey: code, keyDown: down)!
            ev.flags = flags; ev.post(tap: .cghidEventTap); Thread.sleep(forTimeInterval: 0.05)
        }
        print("hidkey \(parts[1])")
    case "frame":
        // frame:<text> — print the element's frame (planning aid)
        if let el = findAny(win, text: parts[1]) {
            var p = CGPoint.zero, sz = CGSize.zero
            if let pv = attr(el, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
            if let sv = attr(el, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
            print("frame \(parts[1]) x\(p.x) y\(p.y) w\(sz.width) h\(sz.height)")
        } else { print("frame \(parts[1]) -> not found") }
    case "row":
        // row:N — click the N-th (1-based) row of the first table/outline in the window
        func firstTable(_ e: AXUIElement, _ d: Int) -> AXUIElement? {
            let role = str(e, "AXRole")
            if (role == "AXTable" || role == "AXOutline") && str(e, "AXDescription") != "Sidebar" { return e }
            if d > 12 { return nil }
            for k in kids(e) { if let t = firstTable(k, d + 1) { return t } }
            return nil
        }
        guard let table = firstTable(win, 0) else { print("row: no table"); break }
        let rows = (attr(table, "AXVisibleRows") as? [AXUIElement]) ?? []
        let n = Int(parts[1])! - 1
        guard n >= 0, n < rows.count else { print("row \(parts[1]) -> only \(rows.count) rows"); break }
        var p = CGPoint.zero, sz = CGSize.zero
        if let pv = attr(rows[n], "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
        if let sv = attr(rows[n], "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
        let c = CGPoint(x: p.x + min(120, sz.width / 2), y: p.y + sz.height / 2)
        CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.12)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.06)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        let name = kids(rows[n]).compactMap { (attr($0, "AXValue") as? String) ?? (kids($0).compactMap { attr($0, "AXValue") as? String }.first) }.first ?? "?"
        print("row \(parts[1]) -> '\(name)' at \(Int(c.x)),\(Int(c.y))")
    case "pathseg":
        // pathseg:K — click the K-th segment from the END of the path bar (1 = the file itself,
        // 2 = its folder). The bar is the row of static texts along the window's bottom edge.
        var wp = CGPoint.zero, ws = CGSize.zero
        if let pv = attr(win, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &wp) }
        if let sv = attr(win, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &ws) }
        let bottom = wp.y + ws.height
        var segs = [(CGFloat, CGPoint, String)]()
        func walkP(_ e: AXUIElement, _ d: Int) {
            if str(e, "AXRole") == "AXStaticText" {
                var p = CGPoint.zero, sz = CGSize.zero
                if let pv = attr(e, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
                if let sv = attr(e, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
                let v = (attr(e, "AXValue") as? String) ?? ""
                if p.y > bottom - 40 && p.x > wp.x + 330 && p.x < wp.x + ws.width * 0.8 && !v.isEmpty && !v.contains("items") {
                    segs.append((p.x, CGPoint(x: p.x + sz.width / 2, y: p.y + sz.height / 2), v))
                }
            }
            if d < 14 { for k in scope(e, d) { walkP(k, d + 1) } }
        }
        walkP(win, 0)
        segs.sort { $0.0 < $1.0 }
        let k = Int(parts[1])!
        guard k >= 1, k <= segs.count else { print("pathseg \(parts[1]) -> only \(segs.count) segments: \(segs.map { $0.2 })"); break }
        let c = segs[segs.count - k].1
        CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.12)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.06)
        CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        print("pathseg \(parts[1]) -> '\(segs[segs.count - k].2)' of \(segs.map { $0.2 })")
    case "buttons":
        // buttons — every button with description, title, help and frame (planning aid)
        func walkB(_ e: AXUIElement, _ d: Int) {
            let role = str(e, "AXRole")
            if role == "AXButton" || role == "AXMenuButton" || role == "AXDisclosureTriangle" || role == "AXCheckBox" {
                var p = CGPoint.zero, sz = CGSize.zero
                if let pv = attr(e, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
                if let sv = attr(e, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
                print(String(repeating: " ", count: d) + "\(role) desc='\(str(e, "AXDescription"))' title='\(str(e, "AXTitle"))' help='\(str(e, "AXHelp"))' value='\((attr(e, "AXValue") as? String) ?? "")' x\(Int(p.x)) y\(Int(p.y)) \(Int(sz.width))x\(Int(sz.height))")
            }
            if d < 14 { for k in scope(e, d) { walkB(k, d + 1) } }
        }
        walkB(win, 0)
    case "wheel":
        // wheel:<text>,<lines> — scroll-wheel at the element's centre (negative = down/content up)
        let bits = parts[1].split(separator: ",").map(String.init)
        guard let el = findAny(win, text: bits[0]) else { print("wheel \(bits[0]) -> not found"); break }
        var p = CGPoint.zero, sz = CGSize.zero
        if let pv = attr(el, "AXPosition") { AXValueGetValue(pv as! AXValue, .cgPoint, &p) }
        if let sv = attr(el, "AXSize") { AXValueGetValue(sv as! AXValue, .cgSize, &sz) }
        let c = CGPoint(x: p.x + sz.width / 2, y: p.y + sz.height / 2)
        CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: c, mouseButton: .left)!.post(tap: .cghidEventTap)
        Thread.sleep(forTimeInterval: 0.1)
        let lines = Int32(bits[1])!
        let steps = abs(Int(lines)), dir: Int32 = lines < 0 ? -1 : 1
        for _ in 0..<steps {
            CGEvent(scrollWheelEvent2Source: nil, units: .line, wheelCount: 1, wheel1: dir * 3, wheel2: 0, wheel3: 0)!.post(tap: .cghidEventTap)
            Thread.sleep(forTimeInterval: 0.03)
        }
        print("wheel \(bits[0]) \(lines)")
    case "roles":
        // roles — role tree with short values (planning aid)
        func walkR(_ e: AXUIElement, _ d: Int) {
            let v = ((attr(e, "AXValue") as? String) ?? "").prefix(24)
            print(String(repeating: " ", count: d) + str(e, "AXRole") + (v.isEmpty ? "" : " '\(v)'") + (str(e, "AXDescription").isEmpty ? "" : " d='\(str(e, "AXDescription"))'"))
            for k in scope(e, d) { walkR(k, d + 1) }
        }
        walkR(win, 0)
    case "sbar":
        // sbar:<0..1> — set the sidebar's vertical scroll position (0 = top, 1 = bottom) via its scroll bar
        func findScroll(_ e: AXUIElement, _ d: Int) -> AXUIElement? {
            if str(e, "AXRole") == "AXScrollArea", kids(e).contains(where: { str($0, "AXDescription") == "Sidebar" }) { return e }
            if d > 8 { return nil }
            for k in kids(e) { if let f = findScroll(k, d + 1) { return f } }
            return nil
        }
        guard let sa = findScroll(win, 0), let bar = attr(sa, "AXVerticalScrollBar") else { print("sbar: no sidebar scroll bar"); break }
        let v = Double(parts[1])! as CFNumber
        let r = AXUIElementSetAttributeValue(bar as! AXUIElement, "AXValue" as CFString, v)
        Thread.sleep(forTimeInterval: 0.3)
        print("sbar \(parts[1]) -> \(r.rawValue)")
    case "texts":
        // texts — every static text in the window with its depth (planning aid)
        func walkT(_ e: AXUIElement, _ d: Int) {
            let role = str(e, "AXRole")
            if role == "AXStaticText" { let v = (attr(e, "AXValue") as? String) ?? ""; if !v.isEmpty { print(String(repeating: " ", count: d) + v) } }
            if d < 14 { for k in scope(e, d) { walkT(k, d + 1) } }
        }
        walkT(win, 0)
    case "menu":
        // menu:<Menu title>><Item title> — AXPress on the menu-bar item, no activation needed
        let names = parts[1].split(separator: ">").map(String.init)
        guard let barAny = attr(app, "AXMenuBar") else { print("no menu bar"); break }
        let bar = barAny as! AXUIElement
        guard let top = kids(bar).first(where: { str($0, "AXTitle") == names[0] }) else { print("menu \(names[0]) not found: \(kids(bar).map { str($0, "AXTitle") })"); break }
        guard let menu = kids(top).first, let item = kids(menu).first(where: { str($0, "AXTitle").hasPrefix(names[1]) }) else { print("item \(names[1]) not found: \(kids(top).first.map { kids($0).map { str($0, "AXTitle") } } ?? [])"); break }
        let r = AXUIElementPerformAction(item, "AXPress" as CFString)
        print("menu \(parts[1]) -> \(r.rawValue)")
    case "dump":
        // dump: every actionable element of the window (role, description, actions) for planning
        func walk(_ e: AXUIElement, _ d: Int) {
            var acts: CFArray?; AXUIElementCopyActionNames(e, &acts)
            let names = (acts as? [String]) ?? []
            let role = str(e, "AXRole"), desc = str(e, "AXDescription"), title = str(e, "AXTitle"), val = (attr(e, "AXValue") as? String) ?? ""
            if !names.isEmpty && names != ["AXScrollToVisible"] || role == "AXSheet" { print(String(repeating: " ", count: d) + "\(role) '\(title)' '\(desc)' '\(val.prefix(30))' \(names)") }
            if d < 12 { for k in scope(e, d) { walk(k, d + 1) } }
        }
        walk(win, 0)
    default: print("unknown step \(step)")
    }
}
