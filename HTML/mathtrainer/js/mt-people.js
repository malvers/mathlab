/* ============================================================
   MATHTRAINER people — teams, pupils, presence, and the
   random-pupil picker (no-repeat pool with rounds, like
   RandomNamePicker, but as a visible overlay instead of a
   global keyboard hook).
   Team pairing is BY INDEX: teamNames.txt line i (display
   label) ↔ roster file Team<teamsString[i]>.txt — faithful
   to the Java original (labels and files do not match by name).
   ============================================================ */
'use strict';

MT.people = {
    // Java Team.teamsString — roster file basenames by team id
    TEAM_FILES: ['Michael', 'Magdalena', 'Hannah', 'Maria', 'Tibor', 'FiveA', 'FiveB', 'SixB'],
    teamLabels: [],           // from teamNames.txt (or demo)
    team: [],                 // [{name, present, numberTasks, numberRightSolutions}]
    picker: { pool: [], round: 1 }
};

MT.people.firstName = name => name.split(' ')[0];

MT.people.makeStudent = name => ({
    name, present: true, numberTasks: 0, numberRightSolutions: 0
});
// deviation (documented): Java hard-coded pupil 'Michael' to start absent — dropped.

MT.people.loadTeams = async function () {
    const names = await MT.store.readTeamNames();
    MT.people.teamLabels = names || ['Demo'];
};

MT.people.loadTeam = async function (teamId, shuffle) {
    let roster = null;
    if (MT.store.dir) {
        const base = MT.people.TEAM_FILES[teamId] || MT.people.TEAM_FILES[0];
        roster = await MT.store.readRoster(base);
    }
    if (!roster) roster = MT.store.demoTeam();
    // keep presence when reloading the same team (new game keeps absences)
    const oldPresence = new Map(MT.people.team.map(s => [s.name, s.present]));
    let students = roster.map(n => {
        const s = MT.people.makeStudent(n);
        if (MT.people.sameTeamId === teamId && oldPresence.has(n)) s.present = oldPresence.get(n);
        return s;
    });
    if (shuffle) students = MT.shuffled(students);
    MT.people.team = students;
    MT.people.sameTeamId = teamId;
    MT.people.pickerReset();
    return students;
};

MT.people.teamLabel = function () {
    const id = MT.settings.actualTeam;
    const label = MT.people.teamLabels[id] || MT.people.teamLabels[0] || 'Demo';
    return 'Team ' + label;
};

MT.people.presentStudents = () => MT.people.team.filter(s => s.present);

// like the Java original this only flips the flag — the task list of a RUNNING
// game stays untouched; absences apply from the next new game / regeneration
MT.people.togglePresent = function (i) {
    const s = MT.people.team[i];
    if (!s) return;
    s.present = !s.present;
    if (MT.state.splash) MT.tasks.initTasks();   // safe to regenerate before the run starts
};

/* ---------------- random picker (pool + rounds) ---------------- */
MT.people.pickerReset = function () {
    MT.people.picker = { pool: [], round: 1, used: false };
};

MT.people.pickRandom = function () {
    const present = MT.people.presentStudents();
    if (!present.length) return null;
    const p = MT.people.picker;
    let pool = p.pool.filter(s => s.present);
    if (!pool.length) {                       // everyone was picked → next round
        pool = present.slice();
        if (p.used) p.round++;
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    p.pool = pool.filter(s => s !== picked);
    p.used = true;
    return picked;
};
