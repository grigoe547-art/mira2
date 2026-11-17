/* engine3d.js — Three.js 3D side-scrolling engine for Find My Heart (uses LV, A, modal, toast, save from game.js) */
const U=40,rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const PAL=[{g:0xff8fc0,gr:0xff6fa8,fog:0xffb7a0,mt:[0xf59ac0,0xd96fa6],tr:[0xff8fb0,0xffb27a],lt:0xffd2b0,hi:1},
{g:0x6a4fc0,gr:0x9b7bff,fog:0x2a1a5c,mt:[0x3d2a7a,0x2a1a5c],tr:[0x2c2170,0x5b3fb0],lt:0x9a8cff,hi:.6},
{g:0xd24a8a,gr:0xff6fa8,fog:0x4a2060,mt:[0x7a4aa0,0x52307f],tr:[0xffb3d1,0xffd9e8],lt:0xffc0e0,hi:.75}];
const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const glow=(col,s)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:col,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));m.scale.set(s,s,1);return m};
const OG={g:1,hair:0x120b0f,skin:0xe4b592,skin2:0xd9a583,top:0xfff7fb,leg:0xe4b592,shoe:0xf3e6ea,eye:0x3a2418,lip:0xc9506a,sh:.25,sy:1.12},
OB={hair:0x1a1313,skin:0xe0ae8b,skin2:0xd49f7c,top:0xffffff,leg:0xe8e0d2,shoe:0x3a3440,eye:0x3a2a20,lip:0xb86a5a,sh:.31,sy:1.18};
function mkChar(o){const g=new THREE.Group(),n=new THREE.Group();g.add(n);g.scale.setScalar(.93);
const S=(r,x,y,z)=>{const q=new THREE.SphereGeometry(r,28,20);q.scale(x||1,y||1,z||1);return q},Cy=(a,b,h)=>new THREE.CylinderGeometry(a,b,h,28),
mesh=(geo,c,x,y,z,p,r)=>{const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c,roughness:r==null?.55:r}));m.position.set(x,y,z);m.castShadow=true;(p||n).add(m);return m};
const limb=(x,y,len,r,c1,c2,hd,ft)=>{const p=new THREE.Group();p.position.set(x,y,0);n.add(p);const h=len/2;mesh(S(r*1.08),c1,0,0,0,p);mesh(Cy(r,r*.85,h),c1,0,-h/2,0,p);mesh(S(r*.85),c2,0,-h,0,p);mesh(Cy(r*.85,r*.66,h),c2,0,-h*1.5,0,p);
if(ft)mesh(S(r*.9,1,.6,2),hd,0,-len+.01,r*.9,p);else mesh(S(r*.75,1,1.3,.85),hd,0,-len-.02,0,p);return p};
const legL=limb(-.1,.62,.58,.075,o.leg,o.leg,o.shoe,1),legR=limb(.1,.62,.58,.075,o.leg,o.leg,o.shoe,1),
armL=limb(-o.sh,o.sy,.5,.05,o.g?o.skin:o.top,o.skin,o.skin),armR=limb(o.sh,o.sy,.5,.05,o.g?o.skin:o.top,o.skin,o.skin);
// body
if(o.g){const pts=[[0,.26],[.32,.26],[.31,.45],[.26,.66],[.17,.86],[.165,.98],[.2,1.08],[.2,1.12],[0,1.12]].map(a=>new THREE.Vector2(a[0],a[1])),d=mesh(new THREE.LatheGeometry(pts,36),o.top,0,0,0,n,.6);d.scale.z=.78;d.material.side=THREE.DoubleSide;
mesh(S(.22,1,.42,.62),o.skin,0,1.15,0)}
else{mesh(Cy(.2,.19,.2),o.leg,0,.66,0);const pts=[[0,.62],[.19,.62],[.2,.85],[.22,1.1],[.0,1.1]].map(a=>new THREE.Vector2(a[0],a[1])),d=mesh(new THREE.LatheGeometry(pts,36),o.top,0,0,0,n,.75);d.scale.z=.72;d.material.side=THREE.DoubleSide;
mesh(S(.23,1.3,.62,.8),o.top,0,1.14,0,n,.75);mesh(S(.07,.9,1.5,.4),o.skin,0,1.07,.15)}
mesh(Cy(.07,.08,.14),o.skin,0,1.2,0);
// head
const h=new THREE.Group();h.position.y=1.33;n.add(h);const R=o.g?.19:.2,zs=Math.sqrt(R*R-.0054)-.005;
mesh(S(R,1,1.12,1.02),o.skin,0,0,0,h);[-1,1].forEach(s=>mesh(S(.035,.5,1,.8),o.skin,s*R,-.01,-.01,h));
const eyes=[-1,1].map(s=>{const eg=new THREE.Group();eg.position.set(s*.07,.025,zs);h.add(eg);mesh(S(.034,1.15,1,.45),0xffffff,0,0,0,eg,.3);mesh(S(.021,1,1,.5),o.eye,0,0,.01,eg,.2);
mesh(new THREE.BoxGeometry(o.g?.08:.085,o.g?.02:.024,.014),o.hair,s*.075,.075,R*.84,h).rotation.z=-s*.12;return eg});
mesh(S(.03,1,1.1,1),o.skin2,0,-.015,R*.98,h);mesh(S(.045,1.5,.55,.6),o.lip,0,-.085,R*.9,h,.3);
if(o.g){mesh(S(R*1.12,1.02,1.1,1.08),o.hair,0,.035,-.045,h,.3);[-1,1].forEach(s=>mesh(S(.07,.8,5,1.5),o.hair,s*.17,-.3,-.03,h,.3));mesh(S(.2,1.15,3.8,.55),o.hair,0,-.4,-.13,h,.3)}
else{mesh(S(R*1.1,1,1,1.1),o.hair,0,.045,-.05,h,.3);mesh(S(.16,1.1,.5,1),o.hair,0,.19,.03,h,.3);mesh(S(.045,1,1.1,.6),o.hair,0,-.125,R*.78,h);mesh(S(.05,1.8,.4,.5),o.hair,0,-.063,R*.93,h)}
return{g,n,legL,legR,armL,armR,eyes}}
function posec(c,st,t,dt){const w=Math.sin(t*13),k=Math.min(1,dt*16),T={idle:[0,0,.1,-.1],walk:[w*.85,-w*.85,-w*.75,w*.75],jump:[.7,-.3,-2.7,-2.7],fall:[.3,-.3,-2.2,-2.2],land:[.8,.8,-.3,-.3],happy:[0,0,-2.8+Math.sin(t*11)*.35,-2.8-Math.sin(t*11)*.35],hug:[0,0,-1.5,-1.5]}[st];
[c.legL,c.legR,c.armL,c.armR].forEach((p,i)=>p.rotation.x+=(T[i]-p.rotation.x)*k);
const bob=st=='walk'?Math.abs(w)*.05:st=='happy'?Math.abs(Math.sin(t*11))*.12:Math.sin(t*2)*.012,sx=st=='land'?1.15:1,sy=st=='land'?.82:1;
c.n.position.y+=(bob-c.n.position.y)*k;c.n.scale.x+=(sx-c.n.scale.x)*k;c.n.scale.z=c.n.scale.x;c.n.scale.y+=(sy-c.n.scale.y)*k;
const bl=(t%3.2)<.12?.1:1;c.eyes.forEach(e=>e.scale.y=bl)}
const HG=(()=>{const s=new THREE.Shape();s.moveTo(0,-.5);s.bezierCurveTo(-.9,.2,-.5,.9,0,.45);s.bezierCurveTo(.5,.9,.9,.2,0,-.5);const g=new THREE.ExtrudeGeometry(s,{depth:.25,bevelEnabled:true,bevelSize:.07,bevelThickness:.07,bevelSegments:2});g.center();g.scale(.5,.5,.5);return g})();

class Eng{
constructor(){const r=this.r=new THREE.WebGLRenderer({antialias:!FX.low});r.setPixelRatio(Math.min(devicePixelRatio||1,FX.low?1:1.75));r.shadowMap.enabled=!FX.low;$('game').appendChild(r.domElement);
this.clk=new THREE.Clock();this.k={};this.paused=true;this.frozen=false;this.yaw=.6;{const c=r.domElement;let x0=null,id=null;c.style.touchAction='none';c.addEventListener('pointerdown',ev=>{x0=ev.clientX;id=ev.pointerId});c.addEventListener('pointermove',ev=>{if(x0!=null&&ev.pointerId==id){this.yaw-=(ev.clientX-x0)*.006;x0=ev.clientX}});addEventListener('pointerup',ev=>{if(ev.pointerId==id)x0=null})}
addEventListener('keydown',e=>{this.k[e.code]=1;if(/Space|Arrow/.test(e.code))e.preventDefault()});addEventListener('keyup',e=>this.k[e.code]=0);
addEventListener('resize',()=>this.rs());this.rs();this.loop=this.loop.bind(this);this.loop()}
rs(){this.r.setSize(innerWidth,innerHeight);if(this.cam){this.cam.aspect=innerWidth/innerHeight;this.cam.updateProjectionMatrix()}}
loop(){requestAnimationFrame(this.loop);const dt=Math.min(this.clk.getDelta(),.05);if(!this.s||this.paused)return;this.step(dt);this.r.render(this.s,this.cam)}
pts(n,sz,col,fog){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));const p=new THREE.Points(g,new THREE.PointsMaterial({size:sz,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:fog!==false,fog:false}));p.frustumCulled=false;return p}
tree(x,y,z,s,P){const g=new THREE.Group(),m=c=>new THREE.MeshStandardMaterial({color:c,roughness:.9}),tr=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,2.4,7),m(0x6b3a4a));tr.position.y=1.2;tr.castShadow=true;g.add(tr);
for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(.9,1.4),1),m(P.tr[i%2]));c.position.set(rnd(-.9,.9),2.9+rnd(-.3,.9),rnd(-.5,.5));c.castShadow=true;g.add(c)}
g.position.set(x,y,z);g.scale.setScalar(s);this.s.add(g);const ph=rnd(0,6);this.U.push(t=>g.rotation.z=Math.sin(t*.8+ph)*.025)}
start(l){const L=this.L=LV[l],P=PAL[l],S=this.s=new THREE.Scene(),N=this.N=56,H=this.H=new Int8Array(N*N);this.li=l;this.cnt=0;this.frozen=this.over=this.cine=this.hug=this.cw=false;this.paused=false;this.gateOn=false;this.inv=0;this.t=0;this.hT=0;this.lT=0;this.shk=0;this.U=[];this.gl=null;this.yaw=.6;$('fade').style.opacity=0;A.setMode(0);
const cam=this.cam=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,400);cam.position.set(8+Math.sin(.6)*8,6,8+Math.cos(.6)*8);
const sc=document.createElement('canvas');sc.width=2;sc.height=256;const cx=sc.getContext('2d'),gd=cx.createLinearGradient(0,0,0,256);L.sky.forEach((c,i)=>gd.addColorStop(i/(L.sky.length-1),c));cx.fillStyle=gd;cx.fillRect(0,0,2,256);S.background=new THREE.CanvasTexture(sc);S.fog=new THREE.Fog(P.fog,40,150);
this.hl=new THREE.HemisphereLight(P.lt,0x554466,P.hi);S.add(this.hl);const dl=this.dl=new THREE.DirectionalLight(0xffffff,P.hi*.9);dl.castShadow=!FX.low;dl.shadow.mapSize.set(1024,1024);Object.assign(dl.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:80});dl.shadow.camera.updateProjectionMatrix();S.add(dl,dl.target);
const M=(c,e)=>new THREE.MeshStandardMaterial({color:c,roughness:.85,emissive:e||0}),d=new THREE.Object3D(),gx=this.gx=N-9,gz=this.gz=N-9;
// ---- terrain heights (blocks)
const s=l*7.3,am=[1.5,1.9,1.7][l];
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const v=Math.sin(i*.17+s)*am+Math.cos(j*.15+s*1.7)*am+Math.sin((i+j)*.11+s)+Math.sin(i*.37)*Math.cos(j*.31)*.6;let h=Math.max(0,Math.min(4,Math.round(v*.75+1.2)));if(v<-2.7+l*.15)h=-1;
if(Math.hypot(i-8,j-8)<5||Math.hypot(i-gx,j-gz)<5)h=0;if(i<1||j<1||i>N-2||j>N-2)h=5;H[i*N+j]=h}
for(let pass=0;pass<3;pass++)for(let i=2;i<N-2;i++)for(let j=2;j<N-2;j++){const h=H[i*N+j];if(h<0)continue;const nb=Math.min(...[[1,0],[-1,0],[0,1],[0,-1]].map(a=>Math.max(0,H[(i+a[0])*N+j+a[1]])));if(h>nb+2)H[i*N+j]=nb+2}
const TC=[[0xff9ac4,0x9a5a6a,0xb08aa8],[0x7a5fd0,0x3a2a6a,0x4a3a7a],[0xffa6cc,0x8a4a6a,0xc08ab0]][l],list=[],wl=[];
for(let i=0;i<N;i++)for(let j=0;j<N;j++){const h=H[i*N+j];if(h<0){list.push([i,-2,j,2]);wl.push([i,j]);continue}
if(h==5){for(let k=0;k<=5;k++)list.push([i,k,j,3]);continue}
let nb=99;[[1,0],[-1,0],[0,1],[0,-1]].forEach(a=>{const ii=i+a[0],jj=j+a[1];nb=Math.min(nb,ii<0||jj<0||ii>=N||jj>=N?0:Math.max(0,H[ii*N+jj]))});for(let k=Math.min(h,nb);k<=h;k++)list.push([i,k,j,k==h?0:1])}
const tb=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.9}),list.length);tb.receiveShadow=true;
list.forEach((q,n)=>{d.position.set(q[0],q[1]+.5,q[2]);d.updateMatrix();tb.setMatrixAt(n,d.matrix);tb.setColorAt(n,new THREE.Color(q[3]==0?TC[0]:q[3]==3?TC[2]:q[3]==2?0x203060:TC[1]).multiplyScalar(rnd(.88,1.08)))});S.add(tb);
if(wl.length){const wm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,.1,1),new THREE.MeshStandardMaterial({color:0x4aa0ff,transparent:true,opacity:.75,emissive:0x1a4a88}),wl.length);wl.forEach((q,n)=>{d.position.set(q[0],-.45,q[1]);d.updateMatrix();wm.setMatrixAt(n,d.matrix)});S.add(wm);this.U.push(t=>wm.material.opacity=.65+Math.sin(t*2)*.1)}
const bgp=new THREE.Mesh(new THREE.PlaneGeometry(600,600),M(new THREE.Color(P.mt[1]).multiplyScalar(.6)));bgp.rotation.x=-Math.PI/2;bgp.position.set(N/2,-2.5,N/2);S.add(bgp);
// ---- helpers
const used=[],pick=(ds,dg,sep,u)=>{u=u||used;for(let t=0;t<300;t++){const i=3+Math.floor(Math.random()*(N-6)),j=3+Math.floor(Math.random()*(N-6));if(H[i*N+j]<0||Math.hypot(i-8,j-8)<ds||Math.hypot(i-gx,j-gz)<dg||u.some(q=>Math.hypot(q[0]-i,q[1]-j)<sep))continue;u.push([i,j]);return[i,j,H[i*N+j]+1]}return null};
// ---- scenery
for(let k=0;k<30;k++){const a=k/30*6.283,r=N*.85+rnd(12,30),h=rnd(12,26),m=new THREE.Mesh(new THREE.ConeGeometry(rnd(8,13),h,5),new THREE.MeshBasicMaterial({color:P.mt[k%2]}));m.position.set(N/2+Math.cos(a)*r,h/2-3,N/2+Math.sin(a)*r);S.add(m)}
const tu=[];for(let n=0;n<48;n++){const q=pick(5,6,2.6,tu);if(q)this.tree(q[0],q[2],q[1],rnd(.9,1.35),P)}
const fl=[];for(let n=0;n<280;n++){const i=3+Math.floor(Math.random()*(N-6)),j=3+Math.floor(Math.random()*(N-6));if(H[i*N+j]<0)continue;fl.push([i+rnd(-.4,.4),H[i*N+j]+1,j+rnd(-.4,.4)])}
const hd=new THREE.InstancedMesh(new THREE.SphereGeometry(.13,8,6),M(0xffffff,l?0x331133:0),fl.length),st=new THREE.InstancedMesh(new THREE.CylinderGeometry(.015,.015,.4,4),M(0x4f9a5a),fl.length),pal=[[0xff6fa8,0xffd27a,0xffffff],[0xb48cff,0x7fd8ff,0xff9ec4],[0xff3d6f,0xff9ec4,0xffffff]][l];
fl.forEach((f,i)=>{hd.setColorAt(i,new THREE.Color(pal[i%3]));d.position.set(f[0],f[1]+.2,f[2]);d.updateMatrix();st.setMatrixAt(i,d.matrix)});S.add(hd,st);
this.U.push(t=>{fl.forEach((f,i)=>{const w=Math.sin(t*1.6+i);d.position.set(f[0]+w*.05,f[1]+.4,f[2]);d.rotation.z=w*.2;d.updateMatrix();hd.setMatrixAt(i,d.matrix)});hd.instanceMatrix.needsUpdate=true});
// sky rig
const rig=this.rig=new THREE.Group();S.add(rig);
const sm=new THREE.Mesh(new THREE.SphereGeometry(l?5:7,24,16),new THREE.MeshBasicMaterial({color:l?0xfff2c2:0xffd27a,fog:false}));sm.position.set(16,l?22:9,-90);rig.add(sm);const sg=glow(l?0xfff2c2:0xffb070,l?45:60);sg.position.copy(sm.position);rig.add(sg);
if(l){const n=FX.low?120:320,s2=this.pts(n,2,0xffffff,false),a=s2.geometry.attributes.position;for(let i=0;i<n;i++){const u=rnd(0,6.283),v=rnd(.1,1.4);a.setXYZ(i,85*Math.cos(u)*Math.cos(v),85*Math.sin(v),85*Math.sin(u)*Math.cos(v))}rig.add(s2);this.U.push(t=>s2.material.opacity=.6+Math.sin(t*3)*.4);
if(!FX.low){const ss=new THREE.Mesh(new THREE.BoxGeometry(5,.06,.06),new THREE.MeshBasicMaterial({color:0xffffff,fog:false}));ss.visible=false;rig.add(ss);let nx=3;this.U.push(t=>{if(t>nx){nx=t+rnd(4,7);ss.visible=true;ss.userData.t0=t;ss.position.set(rnd(-30,10),rnd(25,45),-80);ss.rotation.z=-.5}if(ss.visible){ss.position.x+=.9;ss.position.y-=.5;if(t-ss.userData.t0>.8)ss.visible=false}})}}
if(l!=1){const n=FX.low?30:90,p=this.pts(n,.18,0xffc2dc),a=p.geometry.attributes.position,v=[];for(let i=0;i<n;i++){a.setXYZ(i,rnd(-16,16),rnd(-1,12),rnd(-16,16));v.push(rnd(.4,1))}rig.add(p);this.U.push((t,dt)=>{for(let i=0;i<n;i++){let y=a.getY(i)-v[i]*dt;if(y<-3)y=12;a.setXYZ(i,a.getX(i)+Math.sin(t+i)*dt*.8,y,a.getZ(i))}a.needsUpdate=true})}
if(l==1&&!FX.low){const n=60,p=this.pts(n,.25,0xfff3a0),a=p.geometry.attributes.position,s3=[];for(let i=0;i<n;i++){a.setXYZ(i,rnd(-14,14),rnd(-2,3),rnd(-14,14));s3.push(rnd(0,9))}rig.add(p);this.U.push(t=>{for(let i=0;i<n;i++)a.setXYZ(i,a.getX(i)+Math.sin(t*.7+s3[i])*.01,a.getY(i)+Math.cos(t*.9+s3[i])*.008,a.getZ(i));a.needsUpdate=true;p.material.opacity=.6+Math.sin(t*4)*.3})}
if(l!=1)for(let i=0;i<10;i++){const g=new THREE.Group(),mt=new THREE.MeshBasicMaterial({color:l?0xcdb8ff:0xffe0ee,transparent:true,opacity:l?.3:.85,fog:false});for(let j=0;j<5;j++){const c=new THREE.Mesh(new THREE.SphereGeometry(rnd(1.5,2.6),10,8),mt);c.position.set(j*2-4,rnd(-.4,.4),0);c.scale.y=.6;g.add(c)}g.position.set(rnd(-30,N+30),rnd(16,24),rnd(-30,N+30));S.add(g);this.U.push((t,dt)=>{g.position.x+=dt*.7;if(g.position.x>N+40)g.position.x=-40})}
if(l==0)for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.35,.25),new THREE.MeshBasicMaterial({color:[0xff9ec4,0xffd27a,0xffffff][i%3],side:THREE.DoubleSide})),bx=rnd(6,N-6),bz=rnd(6,N-6);S.add(m);this.U.push(t=>{const x=bx+Math.sin(t*.5+i)*3,z=bz+Math.cos(t*.6+i)*3;m.position.set(x,this.sf(x,z)+1.4+Math.sin(t*.8+i*2)*.5,z);m.rotation.y=Math.sin(t*20+i)*1.1;m.rotation.z=Math.sin(t*.5+i)*.4})}
if(l==2){const lu=[];for(let n=0;n<16;n++){const q=pick(4,6,6,lu);if(!q)continue;const y=q[2]+rnd(3,4.5),g=new THREE.Mesh(new THREE.SphereGeometry(.25,10,8),new THREE.MeshBasicMaterial({color:0xffc060})),h=glow(0xffc060,3.2),po=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,y-q[2],6),M(0x6b3a4a));po.position.set(q[0],(y+q[2])/2,q[1]);g.position.set(q[0],y,q[1]);h.position.copy(g.position);S.add(g,h,po);this.U.push(t=>h.material.opacity=.7+Math.sin(t*2+n)*.25)}
const fx=gx-4,fz=gz+3,b=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.4,.6,18),M(0xcdbbe0));b.position.set(fx,1.3,fz);S.add(b);const n=70,p=this.pts(n,.14,0x9fd8ff),a=p.geometry.attributes.position,vx=[],vz=[];for(let i=0;i<n;i++){vx.push(rnd(-1,1));vz.push(rnd(-1,1))}S.add(p);this.U.push(t=>{for(let i=0;i<n;i++){const q=(t*1.1+i/n)%1;a.setXYZ(i,fx+vx[i]*q*1.2,1.6+q*3.6*(1-q)*2.2,fz+vz[i]*q*1.2)}a.needsUpdate=true})}
// obstacles
this.th=[];for(let n=0;n<[9,14,20][l];n++){const q=pick(9,7,3);if(!q)continue;const g=new THREE.Group();[[-.18,0],[.18,.05],[0,-.18]].forEach((o,i)=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.14,.6-i*.1,7),M(0x9b2d5e,0x330011));c.position.set(o[0],.3,o[1]);g.add(c)});g.position.set(q[0],q[2],q[1]);S.add(g);this.th.push({x:q[0],z:q[1],y:q[2]})}
this.orbs=[];for(let n=0;n<[4,6,8][l];n++){const q=pick(9,7,3);if(!q)continue;const ax=Math.random()<.5?0:1,a=ax?q[1]:q[0],b=Math.min(a+6,N-4);let my=0;for(let c=a;c<=b;c++)my=Math.max(my,this.sf(ax?q[0]:c,ax?c:q[1]));const m=new THREE.Mesh(new THREE.IcosahedronGeometry(.4,0),M(0x7a3cc9,0x5b2aa0)),h=glow(0xb48cff,2.2);m.castShadow=true;S.add(m,h);this.orbs.push({m,h,ax,a,b,c:a,d:1,fix:ax?q[0]:q[1],y:my+1.3,x:q[0],z:q[1]})}
// hearts & photos
this.hearts=[];for(let i=0;i<L.H;i++){const q=pick(10,6,4);if(!q)continue;const m=new THREE.Mesh(HG,M(0xff3d7f,0xff1e66)),h=glow(0xff4d8d,1.8);S.add(m,h);this.hearts.push({m,h,x:q[0],y:q[2]+1.3,z:q[1],i})}
L.H=this.hearts.length;
this.phs=L.ph.map(p=>{const q=pick(12,8,5)||[20,20,2],g=new THREE.Group(),f=new THREE.Mesh(new THREE.BoxGeometry(.7,.85,.06),M(0xffffff,0x888888)),im=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),new THREE.MeshBasicMaterial({color:0xff9ec4}));im.position.set(0,.06,.04);g.add(f,im);const h=glow(0xffe9a8,2.2);S.add(g,h);return{g,h,x:q[0],y:q[2]+1.2,z:q[1],d:p}});
// goal
if(L.boy){this.boy=mkChar(OB);this.boy.g.position.set(gx,1,gz);S.add(this.boy.g)}
else{const r=new THREE.Mesh(new THREE.TorusGeometry(1.1,.1,10,32),new THREE.MeshBasicMaterial({color:0xffe9a8})),h=glow(0xffe9a8,5);r.position.set(gx,2.6,gz);h.position.copy(r.position);S.add(r,h);this.U.push(t=>{h.material.opacity=(this.gateOn?1:.3)*(.7+Math.sin(t*3)*.3);r.rotation.y=t})}
// player
this.p={x:8,y:1,z:8,vy:0,ry:.8,g:false,coy:0,jh:false,wasAir:false,mv:false};this.safe={x:8,z:8,y:1,t:0};this.pc=mkChar(OG);S.add(this.pc.g);
const N2=500;this.N2=N2;this.pp=this.pts(N2,.28,0xffffff);this.pp.material.vertexColors=true;this.pp.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(N2*3),3));this.pv=new Float32Array(N2*4);this.pl=new Float32Array(N2);this.pc3=new Float32Array(N2*3);S.add(this.pp);
this.upd();toast(L.n)}
burst(x,y,n,r,g,b,up,sp){const a=this.pp.geometry.attributes.position;let c=0;for(let i=0;i<this.N2&&c<n;i++)if(this.pl[i]<=0){a.setXYZ(i,x,y,(this.bz||0)+rnd(-.3,.3));const an=rnd(0,6.283),s=rnd(.5,1)*(sp||4);this.pv[i*4]=Math.cos(an)*s;this.pv[i*4+1]=Math.sin(an)*s+(up||0);this.pv[i*4+2]=rnd(-1,1)*(sp||4)*.6;this.pv[i*4+3]=up?-1:5;this.pl[i]=rnd(.6,1.2);this.pc3.set([r,g,b],i*3);c++}}
upd(){$('lv').textContent=this.L.n;$('hc').textContent=`❤️ ${this.cnt}/${this.L.H}`}
plus(x,y){const v=new THREE.Vector3(x,y,this.bz||0).project(this.cam),e=document.createElement('div');e.className='plus';e.textContent='+1';e.style.left=(v.x*.5+.5)*innerWidth+'px';e.style.top=(-v.y*.5+.5)*innerHeight+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),900)}
freeze(f){this.frozen=f}
photo(i,msg,b,cb){this.freeze(true);A.fx('win');modal(polHtml(i,msg),b,()=>{this.freeze(false);cb&&cb()})}
sf(x,z){const N=this.N,i=Math.round(x),j=Math.round(z);if(i<0||j<0||i>=N||j>=N)return 9;const h=this.H[i*N+j];return h<0?-1:h+1}
gnd(x,z){const q=.28;return Math.max(this.sf(x-q,z-q),this.sf(x+q,z-q),this.sf(x-q,z+q),this.sf(x+q,z+q))}
collect(h){this.s.remove(h.m,h.h);this.hearts.splice(this.hearts.indexOf(h),1);this.bz=h.z;this.burst(h.x,h.y,36,1,.3,.6,0,5);this.burst(h.x,h.y,14,1,1,.7,0,3);this.plus(h.x,h.y+.5);this.shk=.25;this.hT=.5;this.cnt++;A.fx('heart');this.upd();{const e=$('hc');e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}
if(this.cnt>=this.L.H){this.gateOn=true;
if(this.li==0)this.photo(1,'Every beautiful story has a beginning. And I\'m so happy ours started.','CONTINUE',()=>toast('Follow the arrow to the glowing heart ➜'));
else toast(this.L.boy?'All hearts! Go find him ❤️':'All hearts! Reach the glowing heart ➜')}}
hurt(){if(this.t<this.inv||this.over)return;this.inv=this.t+1.3;A.fx('hurt');toast('Oops! Try again 💕');const p=this.p,s=this.safe;p.x=s.x;p.z=s.z;p.y=s.y+.2;p.vy=0}
finish(){this.over=true;const p=this.p;
if(this.li==2)return this.photo(5,'You are my favorite person, today and always.','CONTINUE',()=>this.doCine());
A.fx('win');this.bz=p.z;this.burst(p.x,p.y+1,60,1,.5,.8,3,5);save.u=Math.max(save.u,this.li+2);store();this.frozen=true;
modal(`<h2>Level complete! ✨</h2><p class="note">${this.li==0?'Our story is just getting started…':'Almost there, my love…'}</p>`,'NEXT LEVEL →',()=>{$('fade').style.opacity=1;setTimeout(()=>this.start(this.li+1),700)})}
doCine(){this.frozen=true;this.over=true;this.cine=true;A.setMode(1);const p=this.p;p.x=this.gx-1.6;p.z=this.gz;p.y=1;p.vy=0;const mx=(p.x+this.gx)/2;this.cf=mx;
const gl=this.gl=glow(0xffc2dc,0.01);gl.position.set(mx,2.4,this.gz-.6);this.s.add(gl);
(async()=>{const W=ms=>new Promise(r=>setTimeout(r,ms));await W(1500);this.cw=true;await W(1100);this.cw=false;this.hug=true;A.fx('win');
await W(7000);$('fade').style.opacity=1;await W(1300);save.u=3;store();hide('hud');hide('touch');showEnd();this.paused=true;$('fade').style.opacity=0})()}
phys(dt){const p=this.p,k=this.k,N=this.N;
let ix=(k.KeyD||k.ArrowRight?1:0)-(k.KeyA||k.ArrowLeft?1:0)+T.ix,iy=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0)+T.iy;const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}
this.yaw+=((k.KeyQ?1:0)-(k.KeyE?1:0))*dt*1.8;
const sn=Math.sin(this.yaw),cs=Math.cos(this.yaw),dx=-sn*iy+cs*ix,dz=-cs*iy-sn*ix,sp=6.2*dt;
const nx=cl(p.x+dx*sp,1.5,N-2.5);if(this.gnd(nx,p.z)<=p.y+1.05)p.x=nx;const nz=cl(p.z+dz*sp,1.5,N-2.5);if(this.gnd(p.x,nz)<=p.y+1.05)p.z=nz;
p.mv=Math.hypot(dx,dz)>.1;if(p.mv)p.ry=Math.atan2(dx,dz);
const j=k.Space||T.j;p.vy-=26*dt;p.y+=p.vy*dt;const g=this.gnd(p.x,p.z);
if(p.y<=g&&p.vy<=0){p.y=g;p.vy=0;p.g=true}else p.g=false;
p.coy=p.g?.1:p.coy-dt;
if(j&&!p.jh&&p.coy>0){p.vy=10.5;p.coy=0;p.g=false;A.fx('jump');this.pc.n.scale.set(.8,1.25,.8);this.bz=p.z;this.burst(p.x,p.y+.1,8,1,.7,.9,0,2)}p.jh=j;if(!j&&p.vy>4)p.vy-=50*dt;
if(p.g&&p.wasAir){this.lT=.14;this.bz=p.z;this.burst(p.x,p.y+.1,10,1,.8,.9,0,2)}p.wasAir=!p.g;
if(p.g&&g>=1&&this.t-this.safe.t>.4)this.safe={x:p.x,z:p.z,y:p.y,t:this.t};
if(g<0&&p.y<=-.8)this.hurt();
for(const q of this.th)if(Math.hypot(p.x-q.x,p.z-q.z)<.7&&p.y<q.y+.6)this.hurt();
this.orbs.forEach(o=>{o.c+=o.d*1.75*dt;if(o.c>=o.b)o.d=-1;if(o.c<=o.a)o.d=1;o.x=o.ax?o.fix:o.c;o.z=o.ax?o.c:o.fix;if(Math.hypot(p.x-o.x,p.y+.7-o.y,p.z-o.z)<.85)this.hurt()});
for(const h of this.hearts.slice())if(Math.hypot(p.x-h.x,p.y+.7-h.y,p.z-h.z)<1.1)this.collect(h);
for(const q of this.phs.slice())if(Math.hypot(p.x-q.x,p.y+.7-q.y,p.z-q.z)<1.2){this.phs.splice(this.phs.indexOf(q),1);this.s.remove(q.g,q.h);this.photo(q.d[2],q.d[3],'CONTINUE')}
if(Math.hypot(p.x-this.gx,p.z-this.gz)<1.9){if(this.gateOn)this.finish();else if(this.t-(this.ht||0)>3){this.ht=this.t;toast('Collect all the hearts first! ❤️')}}}
step(dt){this.t+=dt;const t=this.t,p=this.p,pc=this.pc,cam=this.cam;if(!this.frozen&&!this.over)this.phys(dt);
this.U.forEach(f=>f(t,dt));this.hT-=dt;this.lT-=dt;
const sp=(c,a)=>{let d=a-c.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));c.g.rotation.y+=d*Math.min(1,dt*12)};
if(this.cine){const b=this.boy,bx=b.g.position.x,mx=this.cf;if(this.cw){p.x+=.5*dt;b.g.position.x=Math.max(mx+.3,bx-.5*dt)}
pc.g.position.set(this.hug?mx-.25:p.x,p.y,this.gz);if(this.hug)b.g.position.x+=(mx+.25-b.g.position.x)*Math.min(1,dt*3);sp(pc,Math.PI/2);sp(b,-Math.PI/2);
posec(pc,this.hug?'hug':this.cw?'walk':'idle',t,dt);posec(b,this.hug?'hug':this.cw?'walk':'happy',t,dt);
if(this.hug){this.bz=this.gz;this.burst(mx+rnd(-1.5,1.5),rnd(1.2,3.5),6,1,.4,.7,1.8,1.2);this.burst(mx+rnd(-3,3),rnd(4,6),3,1,.8,.9,-.4,.4);if(this.gl){const s=this.gl.scale.x;this.gl.scale.setScalar(s+(16-s)*dt*.6);this.gl.material.opacity=.9}this.hl.intensity+=(1.3-this.hl.intensity)*dt*.8}}
else{const st=this.hT>0?'happy':!p.g?(p.vy>0?'jump':'fall'):this.lT>0?'land':p.mv?'walk':'idle';pc.g.position.set(p.x,p.y,p.z);sp(pc,p.ry);posec(pc,st,t,dt);pc.g.visible=this.t>=this.inv||Math.floor(t*14)%2==0;
if(this.boy){sp(this.boy,Math.atan2(p.x-this.gx,p.z-this.gz));posec(this.boy,this.gateOn?'happy':'idle',t,dt)}
if(!this.frozen&&!this.over)this.orbs.forEach(o=>0)}
this.hearts.forEach(h=>{h.m.position.set(h.x,h.y+Math.sin(t*2+h.i)*.12,h.z);h.m.rotation.y=t*2+h.i;h.h.position.copy(h.m.position)});
this.phs.forEach(q=>{q.g.position.set(q.x,q.y+Math.sin(t*2)*.12,q.z);q.g.rotation.y=t;q.h.position.copy(q.g.position)});
this.orbs.forEach(o=>{o.m.position.set(o.x,o.y,o.z);o.m.rotation.x=t*2;o.m.rotation.y=t*1.5;o.h.position.copy(o.m.position)});
const a=this.pp.geometry.attributes.position,c=this.pp.geometry.attributes.color;for(let i=0;i<this.N2;i++){if(this.pl[i]>0){this.pl[i]-=dt;const v=this.pv;a.setXYZ(i,a.getX(i)+v[i*4]*dt,a.getY(i)+v[i*4+1]*dt,a.getZ(i)+v[i*4+2]*dt);v[i*4+1]-=v[i*4+3]*dt;const f=Math.max(0,this.pl[i]);c.setXYZ(i,this.pc3[i*3]*f,this.pc3[i*3+1]*f,this.pc3[i*3+2]*f)}else c.setXYZ(i,0,0,0)}a.needsUpdate=c.needsUpdate=true;
// camera
this.shk=Math.max(0,this.shk-dt);const sh=this.shk*.2;let fx,fz;
if(this.cine){const k=Math.min(1,dt*1.2);cam.position.x+=(this.cf-cam.position.x)*k;cam.position.y+=(p.y+1.8-cam.position.y)*k;cam.position.z+=(this.gz+5.4-cam.position.z)*k;cam.lookAt(this.cf,p.y+1.15,this.gz);fx=this.cf;fz=this.gz}
else{const pit=.5,D=9,k=1-Math.exp(-dt*7),tx=p.x+Math.sin(this.yaw)*Math.cos(pit)*D,tz=p.z+Math.cos(this.yaw)*Math.cos(pit)*D;let ty=p.y+1.4+Math.sin(pit)*D;ty=Math.max(ty,this.gnd(tx,tz)+1.2);
cam.position.x+=(tx-cam.position.x)*k+rnd(-sh,sh);cam.position.y+=(ty-cam.position.y)*k;cam.position.z+=(tz-cam.position.z)*k+rnd(-sh,sh);cam.lookAt(p.x,p.y+1.2,p.z);fx=p.x;fz=p.z;
const cm=$('cmp');if(cm){let tx2=this.gx,tz2=this.gz;if(!this.gateOn&&this.hearts.length){let bd=1e9;this.hearts.forEach(h=>{const d=Math.hypot(h.x-p.x,h.z-p.z);if(d<bd){bd=d;tx2=h.x;tz2=h.z}})}const dx=tx2-p.x,dz=tz2-p.z,sn=Math.sin(this.yaw),cs=Math.cos(this.yaw);cm.style.transform=`rotate(${Math.atan2(cs*dx-sn*dz,-sn*dx-cs*dz)}rad)`}}
this.rig.position.copy(cam.position);this.dl.position.set(fx+8,18,fz+14);this.dl.target.position.set(fx,0,fz)}}
