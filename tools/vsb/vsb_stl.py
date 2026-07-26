import os
S = os.environ.get('VSB_TMP', '/tmp/vsb-pipeline')
os.makedirs(S, exist_ok=True)
MASTER = os.environ.get('VSB_MASTER', '/Users/malvers/IdeaProjects/forloop/HTML/vsb-siegel-150mm-edit.svg')
OUT = os.environ.get('VSB_OUT', os.path.expanduser('~/Desktop/vsb-seal-data'))
os.makedirs(OUT, exist_ok=True)
HTML = os.environ.get('VSB_HTML', '/Users/malvers/IdeaProjects/forloop/HTML')
import numpy as np, struct, os
H = np.fromfile(S+'/vsb_h16.raw', dtype='<u2').reshape(2000,2000).astype(np.float64)/65535.0
NS=1000; PAD=20; SIZE=104.0
Hb = np.pad(H.reshape(NS,2,NS,2).mean(axis=(1,3))[::-1,:], PAD, constant_values=0.0)
NST = NS+2*PAD
sig=2.0; k=np.exp(-0.5*(np.arange(-6,7)/sig)**2); k/=k.sum()

def smooth(Z):
    Z=np.apply_along_axis(lambda r: np.convolve(r,k,'same'),1,Z)
    return np.apply_along_axis(lambda c: np.convolve(c,k,'same'),0,Z)

def build(Zfull, name, header):
    # proper decimation: 2x2 MEAN of the smoothed field (no point-picking ripple)
    E = NST - (NST % 2)
    Zd = Zfull[:E,:E].reshape(E//2,2,E//2,2).mean(axis=(1,3))
    ND = Zd.shape[0]
    xd = (np.arange(ND)*2 + 0.5) * (SIZE/(NST-1))
    # normalize span to exactly 0..SIZE for clean walls
    xd = (xd - xd[0]) * (SIZE / (xd[-1]-xd[0]))
    V=[]
    def tri(a,b,c): V.append((a,b,c))
    for i in range(ND-1):
        for j in range(ND-1):
            z00,z10,z01,z11 = Zd[i,j],Zd[i,j+1],Zd[i+1,j],Zd[i+1,j+1]
            p00=(xd[j],xd[i],z00); p10=(xd[j+1],xd[i],z10)
            p01=(xd[j],xd[i+1],z01); p11=(xd[j+1],xd[i+1],z11)
            if abs(z00-z11) <= abs(z10-z01):
                tri(p00,p10,p11); tri(p00,p11,p01)
            else:
                tri(p00,p10,p01); tri(p10,p11,p01)
    def quad(a,b,c,d): tri(a,b,c); tri(a,c,d)
    for j in range(ND-1):
        quad((xd[j],0,0),(xd[j],0,Zd[0,j]),(xd[j+1],0,Zd[0,j+1]),(xd[j+1],0,0))
        quad((xd[j+1],SIZE,0),(xd[j+1],SIZE,Zd[-1,j+1]),(xd[j],SIZE,Zd[-1,j]),(xd[j],SIZE,0))
        quad((0,xd[j+1],0),(0,xd[j+1],Zd[j+1,0]),(0,xd[j],Zd[j,0]),(0,xd[j],0))
        quad((SIZE,xd[j],0),(SIZE,xd[j],Zd[j,-1]),(SIZE,xd[j+1],Zd[j+1,-1]),(SIZE,xd[j+1],0))
    P=[]
    for j in range(ND-1): P.append((xd[j],0.0))
    for i in range(ND-1): P.append((SIZE,xd[i]))
    for j in range(ND-1,0,-1): P.append((xd[j],SIZE))
    for i in range(ND-1,0,-1): P.append((0.0,xd[i]))
    C=(SIZE/2,SIZE/2,0.0)
    for t_ in range(len(P)):
        a=P[t_]; b=P[(t_+1)%len(P)]
        tri(C,(b[0],b[1],0.0),(a[0],a[1],0.0))
    A=np.array(V)
    n1=np.cross(A[:,1]-A[:,0],A[:,2]-A[:,0]); ln=np.linalg.norm(n1,axis=1,keepdims=True); ln[ln==0]=1
    N_=n1/ln
    with open(OUT+'/'+name,'wb') as f:
        f.write(header.ljust(80,b'\0')); f.write(struct.pack('<I',len(A)))
        for t in range(len(A)):
            f.write(struct.pack('<12fH',*N_[t],*A[t,0],*A[t,1],*A[t,2],0))
    q=np.round(A,6)
    e=np.concatenate([q[:,[0,1]],q[:,[1,2]],q[:,[2,0]]])
    lo=np.minimum(e[:,0],e[:,1]); hi=np.maximum(e[:,0],e[:,1])
    kk=np.ascontiguousarray(np.concatenate([lo,hi],axis=1)).view([('',np.float64)]*6)
    _,c=np.unique(kk,return_counts=True)
    return len(A), (not np.count_nonzero(c!=2))

Zr = smooth(np.where(Hb<=0.75, 1.0+Hb*(5.0/0.75), 6.0+(Hb-0.75)*(2.0/0.25)))
Ze = smooth(np.where(Hb<=0.75, 1.0+Hb*(7.0/0.75), 8.0-(Hb-0.75)*(2.0/0.25)))
n1,ok1 = build(Zr, 'vsb-relief.stl', b'VSB seal O100/104mm, smoothed, mean-decimated, adaptive mesh')
n2,ok2 = build(Ze, 'vsb-relief-engraved.stl', b'VSB seal ENGRAVED O100/104mm, smoothed, mean-decimated, adaptive mesh')
print('raised: %d tris %s | engraved: %d tris %s' % (n1,'WATERTIGHT' if ok1 else 'LEAKY', n2,'WATERTIGHT' if ok2 else 'LEAKY'))