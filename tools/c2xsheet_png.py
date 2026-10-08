# tile PNGs (same size) two per row: python tools/c2xsheet_png.py out.png a.png b.png ...
import struct, zlib, sys
def rd(p):
    d=open(p,'rb').read(); i=8; idat=b''; w=h=0
    while i<len(d):
        n=struct.unpack('>I',d[i:i+4])[0]; t=d[i+4:i+8]; c=d[i+8:i+8+n]; i+=12+n
        if t==b'IHDR': w,h=struct.unpack('>II',c[:8])
        if t==b'IDAT': idat+=c
    raw=zlib.decompress(idat); st=w*4+1
    return w,h,[raw[y*st+1:(y+1)*st] for y in range(h)]
out=sys.argv[1]; ims=[rd(f) for f in sys.argv[2:]]; w,h,_=ims[0]; rows=[]
while len(ims)%2: ims.append((w,h,[b'\x00'*(w*4)]*h))
for r in range(len(ims)//2):
    for y in range(h): rows.append(b'\x00'+ims[r*2][2][y]+ims[r*2+1][2][y])
def ch(t,c): return struct.pack('>I',len(c))+t+c+struct.pack('>I',zlib.crc32(t+c)&0xffffffff)
open(out,'wb').write(b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',w*2,h*len(ims)//2,8,6,0,0,0))+ch(b'IDAT',zlib.compress(b''.join(rows)))+ch(b'IEND',b''))
