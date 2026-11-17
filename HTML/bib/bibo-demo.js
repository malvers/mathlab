// DocBibo - demo data for the prototype (step 1). EVERYTHING here is invented: no real pupils, no real books.
// The real catalogue and class lists come later by import from the old library program (step 2) and never into
// this public repo. Book numbers are the six digits of the library label; 980370 is the label Doc photographed,
// so scanning that real book finds a (made-up) entry and starts a loan.
window.BIBO_DEMO = {
    version: 1,

    // number -> book. Several copies of one title each have their own label number.
    books: {
        '980370': { title: 'Zahlenwerk 11 – Analysis', subject: 'Mathematik', grade: '11' },
        '980371': { title: 'Zahlenwerk 11 – Analysis', subject: 'Mathematik', grade: '11' },
        '980372': { title: 'Zahlenwerk 11 – Analysis', subject: 'Mathematik', grade: '11' },
        '980410': { title: 'Zahlenwerk 12 – Stochastik', subject: 'Mathematik', grade: '12' },
        '980411': { title: 'Zahlenwerk 12 – Stochastik', subject: 'Mathematik', grade: '12' },
        '712004': { title: 'Bits & Bytes – Informatik Sek II', subject: 'Informatik', grade: '11–13' },
        '712005': { title: 'Bits & Bytes – Informatik Sek II', subject: 'Informatik', grade: '11–13' },
        '455120': { title: 'Sprachraum Deutsch 11', subject: 'Deutsch', grade: '11' },
        '455121': { title: 'Sprachraum Deutsch 11', subject: 'Deutsch', grade: '11' },
        '630077': { title: 'Talk & Text 12', subject: 'Englisch', grade: '12' },
        '318842': { title: 'Kraftfeld Physik 11', subject: 'Physik', grade: '11' },
        '274530': { title: 'Zellplan Biologie 12', subject: 'Biologie', grade: '12' },
        '590913': { title: 'Zeitlinien Geschichte 11', subject: 'Geschichte', grade: '11' },
        '805566': { title: 'Formelwelt – Tafelwerk', subject: 'Mathematik / Physik', grade: '11–13' }
    },

    // invented names only: real first names with placeholder surnames, classes "Demo ..."
    students: [
        ['Mia Beispiel', 'Demo 11'], ['Mila Beispiel', 'Demo 11'], ['Leon Muster', 'Demo 11'], ['Lena Muster', 'Demo 11'],
        ['Jonas Probe', 'Demo 11'], ['Emma Vorlage', 'Demo 11'], ['Noah Entwurf', 'Demo 11'], ['Hanna Skizze', 'Demo 11'],
        ['Paul Platzhalter', 'Demo 11'], ['Sophie Testlauf', 'Demo 11'], ['Ben Fiktiv', 'Demo 11'], ['Clara Erdacht', 'Demo 11'],
        ['Finn Beispiel', 'Demo 12'], ['Lea Muster', 'Demo 12'], ['Elias Probe', 'Demo 12'], ['Marie Vorlage', 'Demo 12'],
        ['Luis Entwurf', 'Demo 12'], ['Johanna Skizze', 'Demo 12'], ['Felix Platzhalter', 'Demo 12'], ['Ida Testlauf', 'Demo 12'],
        ['Anton Fiktiv', 'Demo 12'], ['Greta Erdacht', 'Demo 12'], ['Emil Ausgedacht', 'Demo 12'], ['Lotta Ausgedacht', 'Demo 12'],
        ['Tim Beispiel', 'Demo FO'], ['Nele Muster', 'Demo FO'], ['Max Probe', 'Demo FO'], ['Lina Vorlage', 'Demo FO'],
        ['Jan Entwurf', 'Demo FO'], ['Amelie Skizze', 'Demo FO'], ['Oskar Platzhalter', 'Demo FO'], ['Frieda Testlauf', 'Demo FO'],
        ['Karl Fiktiv', 'Demo FO'], ['Rosa Erdacht', 'Demo FO']
    ],

    // running loans at seeding time, dates relative to that day: [book, student name, days since out, days until due]
    // - a mix, so the overview shows "überfällig" and "bald fällig" from the start
    loans: [
        ['980371', 'Leon Muster', 40, -12],
        ['712004', 'Finn Beispiel', 29, -1],
        ['805566', 'Max Probe', 28, 0],
        ['455120', 'Emma Vorlage', 26, 2],
        ['318842', 'Lea Muster', 10, 18],
        ['274530', 'Johanna Skizze', 5, 23]
    ]
};
