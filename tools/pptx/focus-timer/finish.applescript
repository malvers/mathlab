-- Applies what python-pptx cannot write: media playback settings and the Wheel exit that
-- drains the pie, once per slide.
--
-- Two traps learned the hard way:
--   * `t` and `out` are reserved words and blow up as variable names.
--   * The play settings MUST be set BEFORE add effect. The other order makes PowerPoint
--     rebuild the timing tree and silently drop the wheel animation.
--
-- usage: osascript finish.applescript <path> <docName> <seconds,seconds,...>
on run argv
	set pptxPath to item 1 of argv
	set docName to item 2 of argv
	set AppleScript's text item delimiters to ","
	set secList to text items of (item 3 of argv)
	set AppleScript's text item delimiters to ""

	tell application "Microsoft PowerPoint"
		activate
		open pptxPath
		-- other sessions may have their own decks open; address ours by name and never
		-- touch presentation 1 blindly
		-- Address our own deck BY NAME - other sessions have their decks open too, and
		-- `presentation 1` would grab whichever happens to be frontmost. The retry covers the
		-- moment right after open, when the name is not registered yet.
		-- (`repeat with pp in presentations` + `set doc to pp` fails with -2763.)
		set doc to missing value
		repeat 20 times
			try
				set doc to presentation docName
				exit repeat
			on error
				delay 0.3
			end try
		end repeat
		if doc is missing value then error "presentation " & docName & " did not open"

		repeat with i from 1 to (count of secList)
			set sld to slide i of doc
			set vid to shape "LAKE_VIDEO" of sld
			set snd to shape "FOCUS_AUDIO" of sld
			set seq to main sequence of timeline of sld

			set vps to animation play settings of animation settings of vid
			set loop until stopped of vps to true
			set rewind move of vps to true
			set aps to animation play settings of animation settings of snd
			set loop until stopped of aps to true
			set hide while not playing of aps to true

			set e1 to add effect seq for vid fx animation type media play trigger with previous
			set e2 to add effect seq for snd fx animation type media play trigger with previous

			set eff to add effect seq for (shape "TIMER_RING" of sld) fx animation type wheel trigger on page click
			set exit animation of eff to true
			set amount of effect parameters of eff to 1
			set duration of timing of eff to ((item i of secList) as real)
			set smooth start of timing of eff to false
			set smooth end of timing of eff to false
		end repeat
		save doc
		return "ok"
	end tell
end run
