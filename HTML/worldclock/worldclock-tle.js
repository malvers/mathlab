// worldclock-tle.js — baked Two-Line Element sets (orbital data) for the tracked satellites.
// Fetched 2026-05-27 from CelesTrak (https://celestrak.org/NORAD/elements/). TLEs age: re-fetch every
// week or two for best accuracy (say "TLE updaten"). Propagation is done in-browser via satellite.js (SGP4).
const SAT_TLE = [
    {
        name: 'ISS', color: '#dffaff', img: 'iss free.png',
        l1: '1 25544U 98067A   26147.16367647  .00012541  00000+0  23194-3 0  9994',
        l2: '2 25544  51.6335  44.1780 0007391 102.4616 257.7200 15.49411560568490'
    },
    {
        name: 'Tiangong', color: '#ff7a55', img: 'tiangong free.png',
        l1: '1 48274U 21035A   26146.85522683  .00011014  00000+0  13679-3 0  9999',
        l2: '2 48274  41.4677  91.7295 0010859 287.6757  72.2896 15.59843934289839'
    },
    {
        name: 'Hubble', color: '#bcd8ff', img: 'hubble free.png',
        l1: '1 20580U 90037B   26147.21374727  .00007247  00000+0  23102-3 0  9997',
        l2: '2 20580  28.4731 223.8923 0001304 273.1252  86.9195 15.30507013785352'
    }
];
