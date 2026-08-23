// Where the pipeline finds its material and where it puts the raw footage.
//
// Every run script used to hardcode a per-session scratchpad path (/private/tmp/claude-…/<uuid>/…).
// Those directories are gone the moment the session ends, so the scripts could not be re-run — the
// work lives in ~/Movies/videopipeline/<project> instead. OUT=… overrides it for a one-off run.
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const REPO = fileURLToPath(new URL('../../', import.meta.url));   // .../forloop/

export const VP_HOME = process.env.VP_HOME || `${os.homedir()}/Movies/videopipeline`;
export const PORTRAIT = `${REPO}HTML/resources/team/team_02.png`;   // Solita for the D-ID bubble
export const VIDEO_LIB = fileURLToPath(new URL('../videos/', import.meta.url));  // every final lands here
export const MUSIC = `${REPO}HTML/resources/Infinity_6min.m4a`;     // bed under every demo

// Working directory of one project ('svp', 'orb', 'wc1440', …), created on demand.
export function workDir(name) {
  const dir = process.env.OUT || `${VP_HOME}/${name}`;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
