import os
S = os.environ.get('VSB_TMP', '/tmp/vsb-pipeline')
os.makedirs(S, exist_ok=True)
MASTER = os.environ.get('VSB_MASTER', '/Users/malvers/IdeaProjects/forloop/HTML/vsb-siegel-150mm-edit.svg')
OUT = os.environ.get('VSB_OUT', os.path.expanduser('~/Desktop/vsb-seal-data'))
os.makedirs(OUT, exist_ok=True)
HTML = os.environ.get('VSB_HTML', '/Users/malvers/IdeaProjects/forloop/HTML')
import numpy as np, os, math, re, struct
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
SCALE=1.2; CX=CY=50.0*SCALE; R_BASE=36.0*SCALE
font=TTFont('/System/Library/Fonts/Supplemental/Times New Roman.ttf')
gs=font.getGlyphSet(); cmap=font.getBestCmap(); upem=font['head'].unitsPerEm

def glyph_polys(ch,steps=16):
    if ord(ch) not in cmap: return None,[]
    name=cmap[ord(ch)]; adv=font['hmtx'][name][0]
    pen=RecordingPen(); gs[name].draw(pen)
    polys=[]; cur=[]; pos=(0.,0.)
    def flat_q(p0,pts):
        seg=[]; offs,last=list(pts[:-1]),pts[-1]; prev=p0
        for i,off in enumerate(offs):
            nxt=last if i==len(offs)-1 else ((off[0]+offs[i+1][0])/2,(off[1]+offs[i+1][1])/2)
            for t in np.linspace(0,1,steps)[1:]:
                seg.append(((1-t)**2*prev[0]+2*(1-t)*t*off[0]+t*t*nxt[0],(1-t)**2*prev[1]+2*(1-t)*t*off[1]+t*t*nxt[1]))
            prev=nxt
        if not offs: seg.append(last)
        return seg
    for op,args in pen.value:
        if op=='moveTo':
            if cur: polys.append(cur)
            cur=[args[0]]; pos=args[0]
        elif op=='lineTo': cur.append(args[0]); pos=args[0]
        elif op=='qCurveTo':
            if args[-1] is None: args=args[:-1]+(cur[0],)
            sg=flat_q(pos,args); cur+=sg; pos=sg[-1]
        elif op=='closePath':
            if cur: polys.append(cur); cur=[]
    if cur: polys.append(cur)
    return adv,polys

# --- per-glyph satin: horizontal scan rows in LOCAL frame -> satin across strokes ---
def glyph_satin(ch,size_mm,mid_arc,bottom):
    adv,polys=glyph_polys(ch)
    if adv is None or not polys: return [],adv and adv*size_mm/upem or 0.5*size_mm
    sc=size_mm/upem
    pts_all=[(x*sc,y*sc) for poly in polys for x,y in poly]
    ymin=min(p[1] for p in pts_all)-0.1; ymax=max(p[1] for p in pts_all)+0.1
    edges=[]
    for poly in polys:
        P=[(x*sc,y*sc) for x,y in poly]
        for i in range(len(P)):
            x1,y1=P[i]; x2,y2=P[(i+1)%len(P)]
            if y1!=y2: edges.append((y1,y2,x1,x2))
    PITCH=0.38; PULL=0.18; MINW=1.0
    # geometry is scanned FINE (0.07mm) so thin horizontal features (E-arms ~0.5mm)
    # can never fall between scanlines; stitches are emitted at PITCH separately
    FSCAN=0.07; STEP=max(1,int(round(PITCH/FSCAN)))
    rows=[]
    y=ymin
    while y<=ymax:
        xs=[]
        for y1,y2,x1,x2 in edges:
            if (y1<=y<y2) or (y2<=y<y1): xs.append(x1+(y-y1)/(y2-y1)*(x2-x1))
        xs.sort()
        ivs=[]
        for k in range(0,len(xs)-1,2):
            a,b=xs[k],xs[k+1]
            if ivs and a-ivs[-1][1]<0.1: ivs[-1]=[ivs[-1][0],max(ivs[-1][1],b)]
            else: ivs.append([a,b])
        rows.append((y,[tuple(v) for v in ivs])); y+=FSCAN
    patches=[]; active=[]
    for y,ivs in rows:
        used=[False]*len(ivs); nxt=[]
        for pa in active:
            la,lb=pa[1]; hits=[i for i,(a,b) in enumerate(ivs) if not used[i] and a<lb and la<b]
            # split when widths jump (stem vs arm slab, cap vs bowls): a patch keeps
            # similar row widths or its satin/underlay would cross counters
            if hits:
                i=max(hits,key=lambda i:min(lb,ivs[i][1])-max(la,ivs[i][0]))
                ov=min(lb,ivs[i][1])-max(la,ivs[i][0])
                if ov<0.55*max(lb-la,ivs[i][1]-ivs[i][0]): hits=[]
            if hits:
                used[i]=True; pa[0].append((y,ivs[i])); pa[1]=ivs[i]; nxt.append(pa)
            else: patches.append(pa[0])
        for i,(a,b) in enumerate(ivs):
            if not used[i]: nxt.append([[(y,(a,b))],(a,b)])
        active=nxt
    patches+=[pa[0] for pa in active]
    adv_mm=adv*sc
    def bend(px,py):
        gx=px-adv_mm/2.0; a=(mid_arc+gx)/R_BASE
        if not bottom: return (CX+(R_BASE+py)*math.sin(a), CY-(R_BASE+py)*math.cos(a))
        return (CX+(R_BASE-py)*math.sin(a), CY+(R_BASE-py)*math.cos(a))
    def widen(a0,b0):
        a,b=a0-PULL,b0+PULL
        if b-a<MINW:
            m=(a+b)/2.0
            a=max(m-MINW/2,a0-0.15); b=min(m+MINW/2,b0+0.15)
        return a,b
    seqs=[]
    for rows_ in patches:
        if not rows_: continue
        hspan=(rows_[-1][0]-rows_[0][0])+FSCAN
        wmean=sum(b-a for _,(a,b) in rows_)/len(rows_)
        if wmean>2.0*hspan and wmean>2.2:
            # wide flat stroke (arms of E/T, O caps): satin ACROSS it as columns
            xs0=min(a for _,(a,b) in rows_); xs1=max(b for _,(a,b) in rows_)
            cols=[]; x=xs0+PITCH/2
            while x<xs1:
                span=[y for y,(a,b) in rows_ if a<=x<=b]
                if span:
                    cols.append((x,widen(min(span),max(span))))
                x+=PITCH
            if not cols: continue
            under=[]
            if len(cols)>=3:
                for k,(x,(ya,yb)) in enumerate(cols[::4]):
                    ia,ib=ya+0.3,yb-0.3
                    if ib<=ia: ia=ib=(ya+yb)/2.0
                    pair=[(x,ia),(x,ib)] if k%2==0 else [(x,ib),(x,ia)]
                    under+=[bend(*p) for p in pair]
            satin=[]
            for k,(x,(ya,yb)) in enumerate(cols[::-1]):
                pair=[(x,ya),(x,yb)] if k%2==0 else [(x,yb),(x,ya)]
                satin+=[bend(*p) for p in pair]
            seqs.append(under+satin)
            continue
        emit=rows_[::STEP]
        if emit[-1][0]!=rows_[-1][0]: emit=emit+[rows_[-1]]
        under=[]
        if len(emit)>=3:
            for k,(y,(a0,b0)) in enumerate(emit[::4]):
                a,b=widen(a0,b0); ia,ib=a+0.3,b-0.3
                if ib<=ia: ia=ib=(a+b)/2.0
                pair=[(ia,y),(ib,y)] if k%2==0 else [(ib,y),(ia,y)]
                under+=[bend(*p) for p in pair]
        satin=[]
        # bottom-up so the underlay->satin connector stays at the patch tip
        for k,(y,(a0,b0)) in enumerate(emit[::-1]):
            a,b=widen(a0,b0)
            pair=[(a,y),(b,y)] if k%2==0 else [(b,y),(a,y)]
            satin+=[bend(*p) for p in pair]
        seqs.append(under+satin)
    return seqs,adv_mm

def layout_text(text,size_mm,spacing_mm,bottom):
    entries=[]
    for ch in text:
        adv,_=glyph_polys(ch)
        entries.append(adv*size_mm/upem if adv else 0.5*size_mm)
    total=sum(entries)+spacing_mm*(len(entries)-1)
    out=[]; s=-total/2.0
    for ch,adv in zip(text,entries):
        if ch.strip():
            sq,_=glyph_satin(ch,size_mm,s+adv/2.0,bottom)
            out+=sq
        s+=adv+spacing_mm
    return out
# ---- lettering straight from the MASTER SVG (single source of truth) ----
import re as _re
_MASTER = MASTER
def _master_loops(pid):
    svg=open(_MASTER).read()
    m=_re.search(r'id="%s"[^>]*d="([^"]*)"'%pid,svg)
    loops=[];cur=None
    for c in _re.finditer(r'([MCZ])([-\d. ]*)',m.group(1)):
        nm=[float(x) for x in c.group(2).split()] if c.group(2).strip() else []
        if c.group(1)=='M':
            if cur and len(cur)>2: loops.append(cur)
            cur=[(nm[0],nm[1])]
        elif c.group(1)=='C':
            x0,y0=cur[-1];c1=(nm[0],nm[1]);c2=(nm[2],nm[3]);p3=(nm[4],nm[5])
            L=math.hypot(p3[0]-x0,p3[1]-y0)+math.hypot(c1[0]-x0,c1[1]-y0)+math.hypot(c2[0]-p3[0],c2[1]-p3[1])
            n=max(3,int(L/0.05))
            for k in range(1,n+1):
                tt=k/n;mt=1-tt
                cur.append((mt**3*x0+3*mt*mt*tt*c1[0]+3*mt*tt*tt*c2[0]+tt**3*p3[0],
                            mt**3*y0+3*mt*mt*tt*c1[1]+3*mt*tt*tt*c2[1]+tt**3*p3[1]))
        elif c.group(1)=='Z':
            if cur and len(cur)>2: loops.append(cur)
            cur=None
    if cur and len(cur)>2: loops.append(cur)
    return loops

def region_satin(loops_local, bottom):
    # the proven fine-scan satin engine, fed with UNBENT master outlines
    PITCH=0.38; PULL=0.18; MINW=1.0
    FSCAN=0.07; STEP=max(1,int(round(PITCH/FSCAN)))
    pts_all=[p for lp in loops_local for p in lp]
    ymin=min(p[1] for p in pts_all)-0.1; ymax=max(p[1] for p in pts_all)+0.1
    edges=[]
    for P in loops_local:
        for i in range(len(P)):
            x1,y1=P[i]; x2,y2=P[(i+1)%len(P)]
            if y1!=y2: edges.append((y1,y2,x1,x2))
    rows=[]
    y=ymin
    while y<=ymax:
        xs=[]
        for y1,y2,x1,x2 in edges:
            if (y1<=y<y2) or (y2<=y<y1): xs.append(x1+(y-y1)/(y2-y1)*(x2-x1))
        xs.sort()
        ivs=[]
        for k in range(0,len(xs)-1,2):
            a,b=xs[k],xs[k+1]
            if ivs and a-ivs[-1][1]<0.1: ivs[-1]=[ivs[-1][0],max(ivs[-1][1],b)]
            else: ivs.append([a,b])
        rows.append((y,[tuple(v) for v in ivs])); y+=FSCAN
    patches=[]; active=[]
    for y,ivs in rows:
        used=[False]*len(ivs); nxt=[]
        for pa in active:
            la,lb=pa[1]; hits=[i for i,(a,b) in enumerate(ivs) if not used[i] and a<lb and la<b]
            if hits:
                i=max(hits,key=lambda i:min(lb,ivs[i][1])-max(la,ivs[i][0]))
                ov=min(lb,ivs[i][1])-max(la,ivs[i][0])
                if ov<0.55*max(lb-la,ivs[i][1]-ivs[i][0]): hits=[]
            if hits:
                used[i]=True; pa[0].append((y,ivs[i])); pa[1]=ivs[i]; nxt.append(pa)
            else: patches.append(pa[0])
        for i,(a,b) in enumerate(ivs):
            if not used[i]: nxt.append([[(y,(a,b))],(a,b)])
        active=nxt
    patches+=[pa[0] for pa in active]
    def bend(px,py):
        a=px/R_BASE
        if not bottom: return (CX+(R_BASE+py)*math.sin(a), CY-(R_BASE+py)*math.cos(a))
        return (CX+(R_BASE-py)*math.sin(a), CY+(R_BASE-py)*math.cos(a))
    def widen(a0,b0):
        a,b=a0-PULL,b0+PULL
        if b-a<MINW:
            m=(a+b)/2.0
            a=max(m-MINW/2,a0-0.15); b=min(m+MINW/2,b0+0.15)
        return a,b
    seqs=[]
    for rows_ in patches:
        if not rows_: continue
        hspan=(rows_[-1][0]-rows_[0][0])+FSCAN
        wmean=sum(b-a for _,(a,b) in rows_)/len(rows_)
        if wmean>2.0*hspan and wmean>2.2:
            xs0=min(a for _,(a,b) in rows_); xs1=max(b for _,(a,b) in rows_)
            cols=[]; x=xs0+PITCH/2
            while x<xs1:
                span=[y for y,(a,b) in rows_ if a<=x<=b]
                if span:
                    s0,s1=min(span),max(span)
                    ya,yb=s0-PULL,s1+PULL
                    if yb-ya<MINW:
                        m=(ya+yb)/2.0
                        ya=max(m-MINW/2,s0-0.15); yb=min(m+MINW/2,s1+0.15)
                    cols.append((x,(ya,yb)))
                x+=PITCH
            if not cols: continue
            under=[]
            if len(cols)>=3:
                for k,(x,(ya,yb)) in enumerate(cols[::4]):
                    ia,ib=ya+0.3,yb-0.3
                    if ib<=ia: ia=ib=(ya+yb)/2.0
                    pair=[(x,ia),(x,ib)] if k%2==0 else [(x,ib),(x,ia)]
                    under+=[bend(*p) for p in pair]
            satin=[]
            for k,(x,(ya,yb)) in enumerate(cols[::-1]):
                pair=[(x,ya),(x,yb)] if k%2==0 else [(x,yb),(x,ya)]
                satin+=[bend(*p) for p in pair]
            seqs.append(under+satin)
            continue
        emit=rows_[::STEP]
        if emit[-1][0]!=rows_[-1][0]: emit=emit+[rows_[-1]]
        under=[]
        if len(emit)>=3:
            for k,(y,(a0,b0)) in enumerate(emit[::4]):
                a,b=widen(a0,b0); ia,ib=a+0.3,b-0.3
                if ib<=ia: ia=ib=(a+b)/2.0
                pair=[(ia,y),(ib,y)] if k%2==0 else [(ib,y),(ia,y)]
                under+=[bend(*p) for p in pair]
        satin=[]
        for k,(y,(a0,b0)) in enumerate(emit[::-1]):
            a,b=widen(a0,b0)
            pair=[(a,y),(b,y)] if k%2==0 else [(b,y),(a,y)]
            satin+=[bend(*p) for p in pair]
        seqs.append(under+satin)
    return seqs

def master_letter_satin():
    U=SCALE/1.5   # master mm -> stick units
    tops=[]; bots=[]
    for lp in _master_loops('lettering'):
        cy=sum(p[1] for p in lp)/len(lp)
        (tops if cy<75.0 else bots).append(lp)
    def unbend(loops, bottom):
        out=[]
        for lp in loops:
            P=[]
            for x,y in lp:
                dx=(x-75.0)*U; dy=(y-75.0)*U
                r=math.hypot(dx,dy)
                if not bottom:
                    ang=math.atan2(dx,-dy)
                    P.append((ang*R_BASE, r-R_BASE))
                else:
                    ang=math.atan2(dx,dy)
                    P.append((ang*R_BASE, R_BASE-r))
            out.append(P)
        return out
    return region_satin(unbend(tops,False),False), region_satin(unbend(bots,True),True)

motto,vsb=master_letter_satin()
print('satin regions: motto %d, vsb %d'%(len(motto),len(vsb)))

# --- tree fill v3: 0.38 rows, stagger, perpendicular underlay, bean outline ---
N=592
tm=np.fromfile(S+'/ygg592_master.gray',dtype=np.uint8).reshape(N,N)<128
def regions(mask):
    lab=np.zeros(mask.shape,bool); H,W=mask.shape; comps=[]
    ys,xs=np.nonzero(mask)
    for sy,sx in zip(ys,xs):
        if lab[sy,sx]: continue
        stack=[(sy,sx)]; lab[sy,sx]=True; px=[]
        while stack:
            y,x=stack.pop(); px.append((y,x))
            for ny,nx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
                if 0<=ny<H and 0<=nx<W and mask[ny,nx] and not lab[ny,nx]:
                    lab[ny,nx]=True; stack.append((ny,nx))
        comps.append(px)
    return comps
A_PX=0.105*0.105   # mm2 per source pixel
for px in regions(tm):          # only true dust; keep every real leaf dot
    if len(px)*A_PX<0.25:
        for y,x in px: tm[y,x]=False
RES=0.1; NP_=int(100.0*SCALE/RES)
mm=(np.arange(NP_)+0.5)*RES
TX0,TS=24.0*SCALE,52.0*SCALE
tree_mask=np.zeros((NP_,NP_),bool)
fx=(mm-TX0)/TS*(N-1)
idx=np.where((fx>=0)&(fx<=N-1))[0]
xf=fx[idx]; x0=np.floor(xf).astype(int); x1=np.minimum(x0+1,N-1); wx=xf-x0
T=tm.astype(np.float32)
for r in idx:
    yf=fx[r]; y0=int(yf); y1=min(y0+1,N-1); wy=yf-y0
    row=(T[y0,x0]*(1-wx)+T[y0,x1]*wx)*(1-wy)+(T[y1,x0]*(1-wx)+T[y1,x1]*wx)*wy
    tree_mask[r,idx]=row>=0.5
def dilate(m,px):
    o=m.copy()
    for dx in range(-px,px+1):
        for dy in range(-px,px+1):
            if dx*dx+dy*dy<=px*px: o|=np.roll(np.roll(m,dy,0),dx,1)
    return o
def erode(m,px): return ~dilate(~m,px)
# green channels narrower than ~0.4mm close under thread anyway — pre-open them
# by slimming the gold locally (0.2mm per side) ONLY at those pinch points
narrow=erode(dilate(tree_mask,2),2)&~tree_mask
thick=dilate(erode(tree_mask,2),2)   # strokes >=0.4mm can afford slimming
tree_mask=tree_mask&~(dilate(narrow,2)&thick)&~dilate(narrow,1)
def fill(mask,pitch_px,stitch_mm,transpose=False,stagger=True):
    M=mask.T if transpose else mask
    segsD={}
    for r in range(0,NP_,pitch_px):
        line=M[r]; d=np.diff(line.astype(int))
        st=list(np.where(d==1)[0]+1); en=list(np.where(d==-1)[0]+1)
        if line[0]: st=[0]+st
        if line[-1]: en=en+[NP_]
        segsD[r]=[(a,b) for a,b in zip(st,en) if b-a>=2]
    patches=[]; active=[]
    for r in sorted(segsD):
        new=segsD[r]; used=[False]*len(new); nxt=[]
        for pa in active:
            la,lb=pa[1]; hits=[i for i,(a,b) in enumerate(new) if not used[i] and a<lb and la<b]
            if hits:
                i=max(hits,key=lambda i:min(lb,new[i][1])-max(la,new[i][0]))
                ov=min(lb,new[i][1])-max(la,new[i][0])
                if ov<0.62*max(lb-la,new[i][1]-new[i][0]): hits=[]
            if hits:
                used[i]=True; pa[0].append((r,new[i])); pa[1]=new[i]; nxt.append(pa)
            else: patches.append(pa[0])
        for i,(a,b) in enumerate(new):
            if not used[i]: nxt.append([[(r,(a,b))],(a,b)])
        active=nxt
    patches+=[pa[0] for pa in active]
    seqs=[]
    for rows_ in patches:
        if not rows_: continue
        pts=[]
        for k,(r,(a,b)) in enumerate(rows_):
            u=(r+0.5)*RES; xa,xb=(a+0.5)*RES,(b-0.5)*RES
            n=max(1,int((xb-xa)/stitch_mm))
            ph=(k%3)/3.0*stitch_mm if stagger else 0
            ln=[xa]+[min(xb,xa+ph+i*stitch_mm) for i in range(1,n+1) if xa+ph+i*stitch_mm<xb]+[xb]
            if k%2: ln=ln[::-1]
            pts+=[((v,u) if not transpose else (u,v)) for v in ln]
        seqs.append(pts)
    return seqs
tree_under=fill(tree_mask,15,2.0,transpose=True,stagger=False)
tree_fill=fill(tree_mask,3,3.0)
def chaikin(loop,it=2):
    for _ in range(it):
        o=[]
        for i in range(len(loop)):
            p=np.array(loop[i]); q=np.array(loop[(i+1)%len(loop)])
            o.append(tuple(0.75*p+0.25*q)); o.append(tuple(0.25*p+0.75*q))
        loop=o
    return loop
def marching(mask,cell):
    n=mask.shape[0]; segs={}
    M=np.zeros((n+2,n+2),bool); M[1:-1,1:-1]=mask
    idx=(M[:-1,:-1].astype(int)<<3)|(M[:-1,1:].astype(int)<<2)|(M[1:,1:].astype(int)<<1)|M[1:,:-1].astype(int)
    tab={1:[('L','B')],2:[('B','R')],3:[('L','R')],4:[('R','T')],5:[('L','T'),('R','B')],6:[('B','T')],7:[('L','T')],8:[('T','L')],9:[('T','B')],10:[('T','R'),('B','L')],11:[('T','R')],12:[('R','L')],13:[('R','B')],14:[('B','L')]}
    ii,jj=np.nonzero((idx!=0)&(idx!=15))
    for i,j in zip(ii,jj):
        pts={'T':(j+0.5,i),'B':(j+0.5,i+1),'L':(j,i+0.5),'R':(j+1,i+0.5)}
        for a,b in tab[idx[i,j]]: segs.setdefault(pts[a],[]).append(pts[b])
    loops=[]
    while segs:
        st=next(iter(segs)); lp=[st]; cur=segs[st].pop()
        if not segs[st]: del segs[st]
        while cur!=st and cur in segs:
            lp.append(cur); nx=segs[cur].pop()
            if not segs[cur]: del segs[cur]
            cur=nx
        if len(lp)>10: loops.append([((x-1)*cell,(y-1)*cell) for x,y in lp])
    return loops
def resample(loop,step):
    pts=[loop[0]]
    for i in range(1,len(loop)+1):
        a=np.array(pts[-1]); b=np.array(loop[i%len(loop)])
        d=float(np.linalg.norm(b-a))
        while d>=step:
            a=a+(b-a)/d*step; pts.append(tuple(a)); d=float(np.linalg.norm(b-a))
    return pts
def bean(loop):
    o=[]
    for i in range(len(loop)-1): o+=[loop[i],loop[i+1],loop[i],loop[i+1]]
    return o
ALLOW=dilate(tree_mask,2)   # gold + 0.2mm tolerance for edge-following outlines
def in_gold(p):
    gx=int(p[0]/RES); gy=int(p[1]/RES)
    return 0<=gx<NP_ and 0<=gy<NP_ and ALLOW[gy,gx]
def seg_ok(a,b):
    n=int(max(2,math.hypot(b[0]-a[0],b[1]-a[1])/0.15))
    return all(in_gold((a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)) for t in [i/n for i in range(n+1)])
def clip_gold(P):
    pieces=[]; cur=[P[0]]
    for i in range(1,len(P)):
        if seg_ok(P[i-1],P[i]): cur.append(P[i])
        else:
            if len(cur)>=3: pieces.append(cur)
            cur=[P[i]]
    if len(cur)>=3: pieces.append(cur)
    return pieces
tree_out=[]
CTR=TX0+TS/2.0
for L in marching(tm,1.0):
    per=len(L)*0.105*SCALE
    if per<2.5: continue
    P=resample([(TX0+x*(52*SCALE/N),TX0+y*(52*SCALE/N)) for x,y in chaikin(L)],0.9)
    if per>15:
        tree_out+=[bean(pc) for pc in clip_gold(P)]   # silhouette/voids: bean edge
    else:
        cx=sum(p[0] for p in P)/len(P); cy=sum(p[1] for p in P)/len(P)
        if math.hypot(cx-CTR,cy-CTR)<0.80*TS/2.0:
            tree_out+=clip_gold(P)                    # leaves/roots: light run
def satin_ring(r1,r2,step=0.19):
    r1*=SCALE; r2*=SCALE
    n=int(2*math.pi*r2/step)
    return [(CX+(r2 if i%2==0 else r1)*math.sin(2*math.pi*i/n),CY-(r2 if i%2==0 else r1)*math.cos(2*math.pi*i/n)) for i in range(n+1)]
def near_order(sq):
    if not sq: return []
    rest=sq[:]; out=[rest.pop(0)]
    while rest:
        last=np.array(out[-1][-1])
        k=min(range(len(rest)),key=lambda i:float(np.linalg.norm(np.array(rest[i][0])-last)))
        out.append(rest.pop(k))
    return out
G={}
G['ringe']=[satin_ring(46.75,49.25),satin_ring(42.6,43.4)]
G['baum_underlay']=near_order(tree_under)
G['baum_fuellung']=near_order(tree_fill)
G['baum_kontur']=tree_out
G['motto']=near_order(motto)
G['vsb']=near_order(vsb)
seqs=G['ringe']+G['baum_underlay']+G['baum_fuellung']+G['baum_kontur']+G['motto']+G['vsb']
TREE_I0=len(G['ringe']); TREE_I1=TREE_I0+len(G['baum_underlay'])+len(G['baum_fuellung'])+len(G['baum_kontur'])
# viewer data: stitch groups as JS, coordinates in mm
import json,base64
gj={k:[[[round(float(x),2),round(float(y),2)] for x,y in sq] for sq in v] for k,v in G.items()}
# gold-on-transparent overlay of the source artwork, aligned to TX0..TX0+TS
rgba=np.zeros((N,N,4),np.uint8)
rgba[tm]=(206,172,86,255)
rgba.tofile(S+'/ovl.raw')
os.system('ffmpeg -y -v error -f rawvideo -pix_fmt rgba -s %dx%d -i "%s/ovl.raw" "%s/ovl.png"'%(N,N,S,S))
b64=base64.b64encode(open(S+'/ovl.png','rb').read()).decode()
js='window.VSB_DATA='+json.dumps({'size_mm':100.0*SCALE,'disc_r':49.0*SCALE,'tree_x':TX0,'tree_s':TS,'groups':gj})+';\nwindow.VSB_OVERLAY="data:image/png;base64,'+b64+'";\n'
open(HTML+'/vsb-stick-daten.js','w').write(js)
print('viewer data written, %.0f kB'%(len(js)/1024))

# --- DST with tie-in/off + trim clusters ---
def enc_val(v):
    d={}; rest=v
    for base in (1,3,9,27,81):
        q=rest%3
        if q==2: q=-1; rest+=3
        d[base]=q; rest//=3
    return d
def enc(dx,dy,jump=False):
    X=enc_val(dx); Y=enc_val(dy); b1=b2=b3=0
    for bit,c in ((0x80,Y[1]==1),(0x40,Y[1]==-1),(0x20,Y[9]==1),(0x10,Y[9]==-1),(0x08,X[9]==-1),(0x04,X[9]==1),(0x02,X[1]==-1),(0x01,X[1]==1)):
        if c: b1|=bit
    for bit,c in ((0x80,Y[3]==1),(0x40,Y[3]==-1),(0x20,Y[27]==1),(0x10,Y[27]==-1),(0x08,X[27]==-1),(0x04,X[27]==1),(0x02,X[3]==-1),(0x01,X[3]==1)):
        if c: b2|=bit
    b3|=0x03
    for bit,c in ((0x20,Y[81]==1),(0x10,Y[81]==-1),(0x08,X[81]==-1),(0x04,X[81]==1),(0x80,jump)):
        if c: b3|=bit
    return bytes((b1,b2,b3))
recs=[]; cur=[0.0,0.0]
def emit(dx,dy,jump=False): recs.append(enc(dx,dy,jump)); cur[0]+=dx; cur[1]+=dy
def moveto(p,jump):
    tx,ty=p[0]*10.0,-p[1]*10.0
    while True:
        dx=int(round(tx-cur[0])); dy=int(round(ty-cur[1]))
        if abs(dx)<=121 and abs(dy)<=121:
            emit(dx,dy,jump); return
        emit(max(-121,min(121,dx)),max(-121,min(121,dy)),True)
def lock():   # tie: 2 back + 2 forth, ~0.6mm
    for d in (6,-6,6,-6): emit(d,0,False)
def trim():   # >=3 net-zero jumps
    for dx,dy in ((3,3),(-6,-6),(3,3)): emit(dx,dy,True)
first=True
for si,sq in enumerate(seqs):
    if not sq: continue
    hop = 0 if first else math.hypot(sq[0][0]*10-cur[0], -sq[0][1]*10-cur[1])
    cut = hop>25
    if not cut and not first and TREE_I0<=si<TREE_I1 and hop>6:
        a=(cur[0]/10.0,-cur[1]/10.0)
        cut = not seg_ok(a,sq[0])     # tree hop over green -> trim regardless of length
    if not first and cut:
        lock(); trim()
    moveto(sq[0], jump=not first)
    lock() if (first or cut) else None
    first=False
    for p in sq[1:]: moveto(p,False)
lock()
recs.append(b'\x00\x00\xF3')
xs=[p[0]*10 for s in seqs for p in s]; ys=[-p[1]*10 for s in seqs for p in s]
hdr=('LA:VSBSEAL \rST:%7d\rCO:  1\r+X:%5d\r-X:%5d\r+Y:%5d\r-Y:%5d\rAX:+    0\rAY:+    0\rMX:+    0\rMY:+    0\rPD:******\r'%(len(recs)-1,int(max(xs)-xs[0]),int(xs[0]-min(xs)),int(max(ys)-ys[0]),int(ys[0]-min(ys)))).encode('ascii')+b'\x1a'
open(OUT+'/vsb-stick.dst','wb').write(hdr.ljust(512,b' ')+b''.join(recs))
th=sum(float(np.linalg.norm(np.array(s[i+1])-np.array(s[i]))) for s in seqs for i in range(len(s)-1))/1000*1.35
print('PRO DST: %d Stiche, ~%.0f m Garn'%(len(recs)-1,th))
NPX=1800; img=np.zeros((NPX,NPX,3),np.uint8); img[:]=(30,30,34)
yy,xx=np.mgrid[0:NPX,0:NPX]; mm2px=NPX/(100.0*SCALE)
rr=np.hypot(xx/mm2px-CX,yy/mm2px-CY)
img[rr<=49*SCALE]=(24,74,44)
def thick(a,b,w=3):
    n=int(max(2,np.hypot(b[0]-a[0],b[1]-a[1])*mm2px))
    for t in np.linspace(0,1,n):
        x=int((a[0]+(b[0]-a[0])*t)*mm2px); y=int((a[1]+(b[1]-a[1])*t)*mm2px)
        img[max(0,y-w):y+w+1,max(0,x-w):x+w+1]=(206,172,86)
for sq in seqs:
    for i in range(len(sq)-1): thick(sq[i],sq[i+1])
img.tofile(S+'/stick3.raw')
os.system('ffmpeg -y -v error -f rawvideo -pix_fmt rgb24 -s %d:%d -i "%s/stick3.raw" "%s/vsb-stick-vorschau.png"'%(NPX,NPX,S,S))
os.system('ffmpeg -y -v error -i "%s/vsb-stick-vorschau.png" -vf "crop=1000:460:400:1330" "%s/zoom_vsb.png"'%(S,S))
print('done')