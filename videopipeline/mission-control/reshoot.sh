#!/bin/bash
# Re-shoot of the Mission Control film: park GENII, record, cut, ALWAYS restore GENII.
#
#     videopipeline/mission-control/reshoot.sh
#
# The demo class GENII holds Doc's 21 staged submissions; the live dashboard (scene 11) would show
# them, so they are parked under ...-GENII-PARKED for the take and put back by the EXIT trap - also
# when the take or the cut fails. Backup of 18.09.2026: ~/Movies/videopipeline/mission-control/
# genii-backup-2026-09-18.json. Needs the Supabase CLI token in ~/.supabase/access-token (read at
# run time, never stored here). BED_GAIN 0.03 = Doc's music level (18.09.2026).
cd /Users/malvers/IdeaProjects/forloop/videopipeline
q() { curl -s -X POST https://api.supabase.com/v1/projects/fyfhxzyymmurlaenmzse/database/query -H "Authorization: Bearer $(cat ~/.supabase/access-token)" -H "Content-Type: application/json" --data "$(python3 -c 'import json,sys;print(json.dumps({"query":sys.argv[1]}))' "$1")"; echo; }
P=infotestfos12-eingang-v1-GENII
restore() {
  q "begin; delete from quiz_runs where quiz='$P'; delete from quiz_leaves where quiz='$P'; delete from quiz_submissions where quiz='$P'; delete from quiz_stats where quiz='$P'; update quiz_submissions set quiz='$P' where quiz='$P-PARKED'; update quiz_stats set quiz='$P' where quiz='$P-PARKED'; commit;"
  echo "RESTORED: $(q "select count(*) n from quiz_submissions where quiz='$P'")"
}
trap restore EXIT
q "begin; update quiz_submissions set quiz='$P-PARKED' where quiz='$P'; update quiz_stats set quiz='$P-PARKED' where quiz='$P'; commit;"
echo "PARKED: $(q "select count(*) n from quiz_submissions where quiz='$P-PARKED'")"
VP_SHOTS=1 node mission-control/run2.mjs 2>&1 | tail -3 || exit 1
[ -f ~/Movies/videopipeline/mission-control/take.json ] && grep -q ERROR ~/Movies/videopipeline/mission-control/take.json && { echo "TAKE HAS ERRORS"; exit 1; }
BED_GAIN=0.03 node mission-control/run3.mjs 2>&1 | grep -E "Hauptteil|FINAL|Error|WARN" 
echo "RESHOOT DONE"
