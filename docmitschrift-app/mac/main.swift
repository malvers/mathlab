// mitschrift-mac: the Mac half of DocMitschrift, everything on this Mac and nothing in the cloud.
//
//   mitschrift-mac transcribe <audio>   one JSON line per sentence: {"start": s, "end": s, "text": "…"}
//                                       (seconds from the start of the file), via Apple's SpeechAnalyzer
//   mitschrift-mac summarize            reads a lesson's words on stdin, prints one JSON object with four
//                                       German lists (stoff, unterricht, hausaufgaben, termine), via
//                                       Apple's on-device language model (Apple Intelligence);
//                                       hausaufgaben and termine as {"punkt", "zitat"}, checked in mitschrift.py
//
// mitschrift.py drives both; Doc never needs to call this by hand.

import AVFoundation
import CoreMedia
import Foundation
import FoundationModels
import Speech

let locale = Locale(identifier: "de_DE")

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

// MARK: - transcribe

struct Sentence: Codable {
    let start: Double
    let end: Double
    let text: String
}

func transcribe(_ path: String) async throws {
    let file = try AVAudioFile(forReading: URL(fileURLWithPath: path))
    let transcriber = SpeechTranscriber(locale: locale, transcriptionOptions: [], reportingOptions: [],
                                        attributeOptions: [.audioTimeRange])
    // the German model comes once (about a minute and a half), afterwards this only checks
    if let request = try await AssetInventory.assetInstallationRequest(supporting: [transcriber]) {
        try await request.downloadAndInstall()
    }
    let analyzer = SpeechAnalyzer(modules: [transcriber])
    let collect = Task { () throws -> [(Double, Double, String)] in
        var out: [(Double, Double, String)] = []
        for try await result in transcriber.results {
            let text = String(result.text.characters).trimmingCharacters(in: .whitespacesAndNewlines)
            if !text.isEmpty { out.append((result.range.start.seconds, result.range.end.seconds, text)) }
        }
        return out
    }
    if let last = try await analyzer.analyzeSequence(from: file) {
        try await analyzer.finalizeAndFinish(through: last)
    } else {
        await analyzer.cancelAndFinishNow()
    }
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.withoutEscapingSlashes, .sortedKeys]
    for (start, end, text) in try await collect.value.sorted(by: { $0.0 < $1.0 }) {
        let line = Sentence(start: (start * 100).rounded() / 100, end: (end * 100).rounded() / 100, text: text)
        print(String(data: try encoder.encode(line), encoding: .utf8)!)
    }
}

// MARK: - summarize

// The on-device model reads about 4,000 tokens at once, instructions and answer included. A 45-minute
// lesson is longer, so it reads the lesson in parts and fills the same four lists for every part.
// Asking for the lists one by one (instead of "a summary") keeps homework and dates from getting lost:
// in the first test a free summary of the same lesson dropped both.
let partWords = 900

// Homework and dates come with the exact words they rest on ("zitat"); mitschrift.py keeps a point only
// when those words really stand in the lesson's text and every number of the point is in them. In the
// first real lesson (05.11.2026, a test day) the model made up 4 + 3 homework and 11 + 8 dates.
let instructions = """
    Du bekommst einen Ausschnitt aus der automatischen Mitschrift einer Unterrichtsstunde. \
    Es spricht fast nur die Lehrkraft, die Spracherkennung macht Fehler. Halte auf Deutsch nur fest, \
    was wirklich gesagt wurde, in kurzen Stichpunkten. Nenne keine Namen von Schülerinnen und Schülern. \
    Nichts erfinden; eine Liste bleibt leer, wenn dazu nichts gesagt wurde. \
    Eine Hausaufgabe nur, wenn die Lehrkraft ausdrücklich etwas für zu Hause oder bis zur nächsten Stunde aufgibt. \
    Ein Termin nur, wenn die Lehrkraft einen Tag, ein Datum oder eine Uhrzeit nennt. \
    Zu jeder Hausaufgabe und jedem Termin gehört ein Zitat: die Wörter aus dem Ausschnitt, auf denen der Punkt beruht, \
    genau so abgeschrieben, wie sie dastehen. Gibt es kein solches Zitat, gibt es auch keinen Punkt. \
    Meist sind beide Listen leer.
    """

// The four lists as a schema built at run time: the @Generable macro needs Xcode, this Mac only has
// the command line tools.
func list(_ name: String, _ description: String) -> DynamicGenerationSchema.Property {
    DynamicGenerationSchema.Property(name: name, description: description,
                                     schema: DynamicGenerationSchema(arrayOf: DynamicGenerationSchema(type: String.self)))
}

// a point with the words it rests on
func quoted(_ name: String, _ description: String) -> DynamicGenerationSchema.Property {
    DynamicGenerationSchema.Property(name: name, description: description, schema: DynamicGenerationSchema(
        arrayOf: DynamicGenerationSchema(name: "Beleg", properties: [
            DynamicGenerationSchema.Property(name: "punkt", description: "Der Punkt, kurz",
                                             schema: DynamicGenerationSchema(type: String.self)),
            DynamicGenerationSchema.Property(name: "zitat", description: "Die Wörter aus dem Ausschnitt, auf denen der Punkt beruht, wörtlich abgeschrieben",
                                             schema: DynamicGenerationSchema(type: String.self)),
        ]), maximumElements: 3))
}

let notesSchema = try! GenerationSchema(root: DynamicGenerationSchema(name: "Notizen", properties: [
    list("stoff", "Welcher Stoff erklärt wurde, mit den Regeln und Begriffen, höchstens 4 kurze Punkte"),
    list("unterricht", "Beispiele und Aufgaben, die im Unterricht vorgerechnet oder bearbeitet wurden, mit Seite und Nummer, falls genannt"),
    quoted("hausaufgaben", "Nur ausdrücklich aufgegebene Hausaufgaben, mit Seite und Nummer; meist leer"),
    quoted("termine", "Nur Termine mit genanntem Tag, Datum oder Uhrzeit: Klausuren, Tests, Abgaben; meist leer"),
]), dependencies: [])

let shorterSchema = try! GenerationSchema(root: DynamicGenerationSchema(name: "Kurzfassung", properties: [
    DynamicGenerationSchema.Property(name: "punkte", description: "Dieselben Inhalte zusammengefasst, ohne Wiederholungen, das Wichtigste zuerst",
                                     schema: DynamicGenerationSchema(arrayOf: DynamicGenerationSchema(type: String.self), maximumElements: 5)),
]), dependencies: [])

func strings(_ content: GeneratedContent, _ name: String) -> [String] {
    ((try? content.value([String].self, forProperty: name)) ?? [])
        .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        .filter { !$0.isEmpty }
}

struct Beleg: Codable {
    let punkt: String
    let zitat: String
}

/// The {punkt, zitat} objects of one list, read straight from the content's structure (no @Generable
/// type without Xcode). A point without its quote is dropped here already.
func belege(_ content: GeneratedContent, _ name: String) -> [Beleg] {
    guard case .structure(let props, _) = content.kind, let list = props[name], case .array(let items) = list.kind
    else { return [] }
    func text(_ c: GeneratedContent?) -> String {
        if let c, case .string(let s) = c.kind { return s.trimmingCharacters(in: .whitespacesAndNewlines) }
        return ""
    }
    return items.compactMap { item in
        guard case .structure(let p, _) = item.kind else { return nil }
        let b = Beleg(punkt: text(p["punkt"]), zitat: text(p["zitat"]))
        return b.punkt.isEmpty || b.zitat.isEmpty ? nil : b
    }
}

struct Summary: Codable {
    var stoff: [String] = []
    var unterricht: [String] = []
    var hausaufgaben: [Beleg] = []
    var termine: [Beleg] = []

    mutating func add(_ c: GeneratedContent) {
        stoff += strings(c, "stoff")
        unterricht += strings(c, "unterricht")
        hausaufgaben += belege(c, "hausaufgaben")
        termine += belege(c, "termine")
    }

    mutating func add(_ s: Summary) {
        stoff += s.stoff
        unterricht += s.unterricht
        hausaufgaben += s.hausaufgaben
        termine += s.termine
    }
}

/// The four lists for one stretch of words; a stretch that is still too long for the model is halved.
func notes(_ words: ArraySlice<Substring>) async -> Summary {
    var summary = Summary()
    do {
        let session = LanguageModelSession(instructions: instructions)
        let answer = try await session.respond(to: words.joined(separator: " "), schema: notesSchema,
                                               options: GenerationOptions(temperature: 0.2))
        summary.add(answer.content)
    } catch LanguageModelSession.GenerationError.exceededContextWindowSize {
        if words.count >= 100 {
            let middle = words.startIndex + words.count / 2
            summary.add(await notes(words[..<middle]))
            summary.add(await notes(words[middle...]))
        }
    } catch {
        FileHandle.standardError.write("part skipped: \(error)\n".data(using: .utf8)!)
    }
    return summary
}

/// Drops repeats, ignoring case and spaces, and keeps the order of the lesson.
func unique(_ points: [String]) -> [String] {
    var seen = Set<String>()
    return points.filter { seen.insert($0.lowercased().filter { !$0.isWhitespace }).inserted }
}

func unique(_ points: [Beleg]) -> [Beleg] {
    var seen = Set<String>()
    return points.filter { seen.insert($0.punkt.lowercased().filter { !$0.isWhitespace }).inserted }
}

/// The same points without repeats; only used when the parts together gave too many.
func shorter(_ points: [String]) async -> [String] {
    let unique = unique(points)
    if unique.count <= 5 { return unique }
    do {
        let session = LanguageModelSession(instructions: "Fasse Stichpunkte aus einer Unterrichtsstunde auf Deutsch zusammen. Nichts erfinden.")
        let answer = try await session.respond(to: unique.map { "- " + $0 }.joined(separator: "\n"), schema: shorterSchema,
                                               options: GenerationOptions(temperature: 0.2))
        let points = strings(answer.content, "punkte")
        return points.isEmpty ? Array(unique.prefix(5)) : points
    } catch {
        return Array(unique.prefix(5))
    }
}

func summarize() async throws {
    let input = String(data: FileHandle.standardInput.readDataToEndOfFile(), encoding: .utf8) ?? ""
    guard case .available = SystemLanguageModel.default.availability else {
        fail("Apple Intelligence ist auf diesem Mac nicht bereit: \(SystemLanguageModel.default.availability)")
    }
    let words = input.split(whereSeparator: \.isWhitespace)
    var summary = Summary()
    var start = 0
    while start < words.count {
        let end = min(start + partWords, words.count)
        summary.add(await notes(words[start..<end]))
        start = end
    }
    // only the topic words go through the model a second time: when it merged worked examples in the
    // test (05.11.2026) it invented a wrong rule, so examples, homework and dates only lose their repeats
    summary.stoff = await shorter(summary.stoff)
    summary.unterricht = Array(unique(summary.unterricht).prefix(8))
    summary.hausaufgaben = unique(summary.hausaufgaben)
    summary.termine = unique(summary.termine)
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.withoutEscapingSlashes, .sortedKeys]
    print(String(data: try encoder.encode(summary), encoding: .utf8)!)
}

// MARK: - main

let args = CommandLine.arguments
do {
    switch args.count > 1 ? args[1] : "" {
    case "transcribe" where args.count > 2:
        try await transcribe(args[2])
    case "summarize":
        try await summarize()
    default:
        fail("usage: mitschrift-mac transcribe <audio> | summarize < text")
    }
} catch {
    fail("\(error)")
}
