#!/usr/bin/env node
/**
 * Automatic Recording File Monitor
 * Watches Downloads folder for .recording files and copies them to HTML/recordings/
 * Usage: node recording-auto-copy.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const DOWNLOADS = path.join(os.homedir(), 'Downloads');
const RECORDINGS_DIR = path.join(__dirname, 'HTML', 'recordings');
const INDEX_FILE = path.join(RECORDINGS_DIR, 'index.json');

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

const loadIndex = () => {
    try {
        if (!fs.existsSync(INDEX_FILE)) return {};
        const data = fs.readFileSync(INDEX_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.warn('Failed to read index.json:', err.message);
        return {};
    }
};

const saveIndex = (index) => {
    try {
        fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf8');
    } catch (err) {
        console.error('Failed to write index.json:', err.message);
    }
};

const processFile = async (filename) => {
    const sourcePath = path.join(DOWNLOADS, filename);

    // Check if file exists and is a .recording file
    if (!filename.endsWith('.recording')) return;
    if (!fs.existsSync(sourcePath)) return;

    try {
        // Wait a bit to ensure file is fully written
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get file stats to verify it's fully written
        const stats = fs.statSync(sourcePath);
        if (stats.size === 0) {
            console.log(`⏳ Skipping empty file: ${filename}`);
            return;
        }

        // Extract lab name (everything before the first space)
        const labName = filename.split(' ')[0];
        if (!labName) {
            console.log(`⚠️  Could not extract lab name from: ${filename}`);
            return;
        }

        // Destination path
        const destPath = path.join(RECORDINGS_DIR, filename);

        // Check if file already exists at destination
        if (fs.existsSync(destPath)) {
            console.log(`⏭️  File already exists at destination: ${filename}`);
            return;
        }

        // Copy file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied: ${filename}`);

        // Update index.json
        const index = loadIndex();
        index[labName] = filename;
        saveIndex(index);
        console.log(`📝 Updated index for lab: ${labName}`);

    } catch (err) {
        console.error(`❌ Error processing ${filename}:`, err.message);
    }
};

// Set up watcher
console.log(`🔍 Watching for recordings in: ${DOWNLOADS}`);
console.log(`📂 Destination: ${RECORDINGS_DIR}`);

let watcher;
try {
    watcher = fs.watch(DOWNLOADS, { persistent: true }, debounce((eventType, filename) => {
        if (eventType === 'change' || eventType === 'rename') {
            if (filename && filename.endsWith('.recording')) {
                processFile(filename);
            }
        }
    }, 1000));

    console.log('✨ Recording monitor active. Press Ctrl+C to stop.\n');
} catch (err) {
    console.error('Failed to create watcher:', err.message);
    process.exit(1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Stopping recording monitor...');
    if (watcher) watcher.close();
    process.exit(0);
});
