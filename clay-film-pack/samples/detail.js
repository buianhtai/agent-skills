import * as T from '../vendor/three.module.js';
import {colored} from '../sculpt.js';

// Tapered, bent strand along +y with a dark-root to light-tip vertex gradient.
function strandGeometry(length,radius,tint,segments=5,sides=4){
 const pos=[],col=[],index=[];
 for(let i=0;i<=segments;i++){
  const t=i/segments,r=radius*(1-t*.92),bend=length*.45*t*t,y=length*t,shade=.55+.6*t;
  for(let j=0;j<sides;j++){const a=j/sides*Math.PI*2;pos.push(Math.cos(a)*r,y,Math.sin(a)*r+bend);col.push(tint.r*shade,tint.g*shade,tint.b*shade);}
 }
 for(let i=0;i<segments;i++)for(let j=0;j<sides;j++){const a=i*sides+j,b=i*sides+(j+1)%sides;index.push(a,a+sides,b,b,a+sides,b+sides);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(index);g.computeVertexNormals();
 return g;
}

// Deterministic fur strands rooted on the skin; with `field` (negative inside) points march out to the true surface.
export function tufts(parent,mat,{center,radii,count,seed=1,length=.1,radius=.02,select=()=>true,field=null}){
 let s=seed>>>0;
 const rand=()=>{s=(Math.imul(s^(s>>>15),2246822507)+0x9e3779b9)>>>0;return s/4294967296;};
 const inst=new T.InstancedMesh(strandGeometry(length,radius,mat.color),colored(mat),count);
 inst.castShadow=true;inst.receiveShadow=true;
 const dummy=new T.Object3D(),up=new T.Vector3(0,1,0),nrm=new T.Vector3(),roll=new T.Quaternion();
 let placed=0;
 for(let guard=0;placed<count&&guard<count*60;guard++){
  const u=rand()*2-1,a=rand()*Math.PI*2,r=Math.sqrt(1-u*u),n=[r*Math.cos(a),u,r*Math.sin(a)];
  if(!select(...n))continue;
  const pos=new T.Vector3(center[0]+n[0]*radii[0],center[1]+n[1]*radii[1],center[2]+n[2]*radii[2]);
  if(field){
   const dir=new T.Vector3(...n),o=new T.Vector3(...center).addScaledVector(dir,Math.min(...radii)*.3);
   if(field(o.x,o.y,o.z)>=0)continue;
   let hit=false;
   for(let k=0;k<200;k++){pos.copy(o).addScaledVector(dir,k*.012);if(field(pos.x,pos.y,pos.z)>=0){hit=true;break;}}
   if(!hit)continue;
   const e=.01;
   nrm.set(field(pos.x+e,pos.y,pos.z)-field(pos.x-e,pos.y,pos.z),field(pos.x,pos.y+e,pos.z)-field(pos.x,pos.y-e,pos.z),field(pos.x,pos.y,pos.z+e)-field(pos.x,pos.y,pos.z-e)).normalize();
  }else nrm.set(n[0]/radii[0],n[1]/radii[1],n[2]/radii[2]).normalize();
  pos.addScaledVector(nrm,-length*.15);
  dummy.position.copy(pos);
  nrm.addScaledVector(new T.Vector3(0,-1,0),.4+.3*rand()).normalize();
  dummy.quaternion.setFromUnitVectors(up,nrm).multiply(roll.setFromAxisAngle(up,rand()*Math.PI*2));
  const tone=.8+.4*rand();inst.setColorAt(placed,new T.Color(tone,tone,tone));
  dummy.scale.set(1.2,.9+.5*rand(),1.2);
  dummy.updateMatrix();inst.setMatrixAt(placed++,dummy.matrix);
 }
 inst.count=placed;inst.instanceMatrix.needsUpdate=true;inst.instanceColor.needsUpdate=true;
 parent.add(inst);
 return inst;
}
