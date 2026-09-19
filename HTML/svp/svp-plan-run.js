// Stoffverteilungsplan - runs the parts svp-plan.js has loaded.
// All in one go and in load order, the way the single file ran: a part's code
// may rely on everything before it, and nothing else gets in between.
// P is what the parts share (see svp-plan.js). The first part answers false
// when the page has no plan table - then nothing runs.
(function () {
    const parts = window.svpPlanParts || [];
    delete window.svpPlanParts;
    const P = {};
    for (const part of parts) if (part(P) === false) return;
})();
