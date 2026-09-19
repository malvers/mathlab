"""Server side of the live tour "Die ganze Klasse im Blick" (HTML/tours/mission-control.html).

tools/tourkritik.py loads this file on every call (edits need no restart) and calls a function by name
when the page POSTs /__tour/hook/<name>. What happens here is exactly what reshoot.sh and run2.mjs do
around a take - the tour is the take, only live:

  setup     GENII's 21 staged submissions are parked under ...-GENII-PARKED, so the live dashboard
            (scene 11) shows only the tour's class. If they are parked already, an earlier tour did not
            end cleanly: its leftovers in the pool are deleted instead (the parked data stays untouched).
  teardown  the tour's rows go, the parked submissions come back - as reshoot.sh's EXIT trap.
            tourkritik.py also calls it when the page is gone for 3 min and when the server stops.
  abort     the second click on the red button needs Doc's svp session, which the tour page does not
            have: quiz_abort runs here as the plan owner, as in run2.mjs (Doc accepted this, 18.09.2026).

The Supabase management token is read from ~/.supabase/access-token at call time, never stored or sent to
the page. Backup of the demo data: ~/Movies/videopipeline/mission-control/genii-backup-2026-09-18.json.
"""
import json
import os
import re
import urllib.request

PROJECT = 'fyfhxzyymmurlaenmzse'
POOL = 'infotestfos12-eingang-v1-GENII'
PARKED = POOL + '-PARKED'
OWNER = '2889073e-cbb8-4ca1-ad48-5234abe40585'      # the plan owner, as in the RLS policies
CODE = re.compile(r'^[A-Z0-9]{4}$')
# Cloudflare answers Python's default user agent with 403 / error 1010 (run2.mjs, the same for node)
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'


def _sql(query):
    with open(os.path.expanduser('~/.supabase/access-token'), encoding='utf-8') as f:
        token = f.read().strip()
    req = urllib.request.Request(
        'https://api.supabase.com/v1/projects/%s/database/query' % PROJECT,
        data=json.dumps({'query': query}).encode('utf-8'),
        headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'User-Agent': UA},
        method='POST')
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode('utf-8') or '[]')


def _count(quiz):
    return _sql("select count(*)::int n from quiz_submissions where quiz = '%s'" % quiz)[0]['n']


_CLEAR_POOL = ("delete from quiz_runs where quiz='{P}'; delete from quiz_leaves where quiz='{P}'; "
               "delete from quiz_submissions where quiz='{P}'; delete from quiz_stats where quiz='{P}';")


def setup(args):
    parked = _count(PARKED)
    if parked:
        # an earlier tour is still armed (tab closed mid-tour, server killed): what is in the pool is ITS rows
        _sql('begin; ' + _CLEAR_POOL.format(P=POOL) + ' commit;')
        how = 'Reste einer früheren Tour gelöscht'
    else:
        _sql("begin; update quiz_submissions set quiz='{Q}' where quiz='{P}'; "
             "update quiz_stats set quiz='{Q}' where quiz='{P}'; ".format(P=POOL, Q=PARKED) +
             # runs and leaves of the staged codes are not kept - exactly as reshoot.sh
             "delete from quiz_runs where quiz='{P}'; delete from quiz_leaves where quiz='{P}'; commit;".format(P=POOL))
        how = 'geparkt'
    left = _count(POOL)
    if left:
        raise RuntimeError('Pool %s ist nach dem Parken nicht leer (%d Abgaben)' % (POOL, left))
    return {'wie': how, 'geparkt': _count(PARKED)}


def teardown(args):
    # ONLY when something is parked, and decided inside the database in one transaction: a second teardown
    # (page end + watchdog, or two tabs) would otherwise empty the pool that just got Doc's staged data back
    _sql("do $$ begin if exists (select 1 from quiz_submissions where quiz='{Q}') "
         "or exists (select 1 from quiz_stats where quiz='{Q}') then ".format(Q=PARKED) +
         _CLEAR_POOL.format(P=POOL) +
         " update quiz_submissions set quiz='{P}' where quiz='{Q}'; "
         "update quiz_stats set quiz='{P}' where quiz='{Q}'; end if; end $$;".format(P=POOL, Q=PARKED))
    return {'zurueck': _count(POOL), 'geparkt': _count(PARKED), 'warum': args.get('why', 'Seite')}


def abort(args):
    code = str(args.get('code') or '')
    if not CODE.match(code):
        raise ValueError('kein gültiger Code: ' + code)
    on = 'true' if args.get('on') else 'false'
    _sql("begin; set local role authenticated; set local request.jwt.claims = "
         "'{\"sub\":\"%s\",\"role\":\"authenticated\"}'; select quiz_abort('%s', '%s', %s); commit;"
         % (OWNER, POOL, code, on))
    return {'code': code, 'abgebrochen': on == 'true'}


def status(args):
    """Read only - for a look from the page or by hand."""
    return {'pool': _count(POOL), 'geparkt': _count(PARKED)}
