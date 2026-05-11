#!/bin/bash
# Automatic Recording File Monitor (Bash version)
# Watches Downloads folder for .recording files and copies them to HTML/recordings/

DOWNLOADS="$HOME/Downloads"
RECORDINGS_DIR="$(cd "$(dirname "$0")" && pwd)/HTML/recordings"
INDEX_FILE="$RECORDINGS_DIR/index.json"

# Initialize index if not exists
if [ ! -f "$INDEX_FILE" ]; then
    echo '{}' > "$INDEX_FILE"
fi

echo "🔍 Watching for recordings in: $DOWNLOADS"
echo "📂 Destination: $RECORDINGS_DIR"

# Get list of existing files to avoid processing them on startup
PROCESSED_FILES=""

while true; do
    # Find all .recording files in Downloads
    for file in "$DOWNLOADS"/*.recording; do
        [ -e "$file" ] || continue

        filename=$(basename "$file")

        # Skip if already processed
        if [[ "$PROCESSED_FILES" == *"$filename"* ]]; then
            continue
        fi

        # Get file size to ensure it's fully written (wait if still changing)
        size1=$(stat -f%z "$file" 2>/dev/null || echo 0)
        sleep 0.5
        size2=$(stat -f%z "$file" 2>/dev/null || echo 0)

        if [ "$size1" -ne "$size2" ]; then
            continue  # File still being written
        fi

        if [ "$size1" -eq 0 ]; then
            continue  # File is empty
        fi

        # Extract lab name (everything before first space)
        labname="${filename%% *}"

        # Check if destination file already exists
        destfile="$RECORDINGS_DIR/$filename"
        if [ -f "$destfile" ]; then
            echo "⏭️  File already exists: $filename"
            PROCESSED_FILES="$PROCESSED_FILES $filename"
            continue
        fi

        # Copy file
        if cp "$file" "$destfile"; then
            echo "✅ Copied: $filename"

            # Update index.json
            # Simple JSON update (careful with special chars)
            python3 -c "
import json
try:
    with open('$INDEX_FILE', 'r') as f:
        index = json.load(f)
except:
    index = {}
index['$labname'] = '$filename'
with open('$INDEX_FILE', 'w') as f:
    json.dump(index, f, indent=2)
" 2>/dev/null && echo "📝 Updated index for lab: $labname" || echo "⚠️  Could not update index"

            PROCESSED_FILES="$PROCESSED_FILES $filename"
        else
            echo "❌ Error copying $filename"
        fi
    done

    sleep 2
done
