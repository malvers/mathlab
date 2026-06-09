// ESLint flat config for the Doc Alvers labs JS (classic browser scripts, NO build step).
// Run WITHOUT committing node_modules:   cd HTML && npx --yes eslint js/
// Catches: undefined globals/typos, direct use-before-define, const reassignment, dup keys.
// NOTE: it does NOT catch "a function called at init-time touches a const declared further down"
// (runtime call-order TDZ) — that's what broke the tracker on 2026-06-09; see the smoke check idea.
//
// Globals are listed by hand (no `globals` npm dep) so this stays zero-install.
const browser = {};
for (const g of [
  'window', 'document', 'navigator', 'location', 'history', 'console', 'localStorage',
  'sessionStorage', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'requestAnimationFrame', 'cancelAnimationFrame', 'fetch', 'performance', 'crypto',
  'URL', 'URLSearchParams', 'Image', 'Blob', 'File', 'FileReader', 'FormData', 'Audio',
  'btoa', 'atob', 'alert', 'confirm', 'prompt', 'CustomEvent', 'Event', 'AbortController',
  'indexedDB', 'IDBKeyRange', 'getComputedStyle', 'matchMedia', 'DeviceMotionEvent',
  'screen', 'innerWidth', 'innerHeight', 'devicePixelRatio', 'structuredClone',
  'TextEncoder', 'TextDecoder', 'WebSocket', 'Notification', 'MutationObserver',
]) browser[g] = 'readonly';

// Globals provided by the other lab scripts / CDNs loaded before tracker.js.
const app = {};
for (const g of [
  'L', 'supabase', 'Capacitor', 'CryptoJS',
  'RainRadar', 'RainPalette', 'RainRecolor', 'CyberClock', 'DebugWindow',
  'PhotoLayer', 'PhotoFullscreen', 'VoiceNote', 'TrackRender', 'TrackSmooth',
  'TrackBuffer', 'AppUpdate', 'TrackerMedia', 'RadialMenu',
]) app[g] = 'readonly';

export default [
  {
    files: ['js/**/*.js', 'tracker/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script', // these are classic <script> files, not ES modules
      globals: { ...browser, ...app },
    },
    rules: {
      'no-use-before-define': ['warn', { functions: false, classes: false, variables: true }],
      'no-undef': 'warn',
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-redeclare': 'warn',
      'no-unsafe-negation': 'warn',
      'no-unused-vars': 'off', // too noisy on this codebase for now
    },
  },
];
