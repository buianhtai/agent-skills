# tufts() usage (from bear.js / tiger.js)
const furBody=group(rig);   // pose(): furBody.position.y=bob; furBody.rotation.x=torso.rotation.x
tufts(furBody,furMat,{center:[0,2.02,.78],radii:[.92,.96,.80],count:1100,seed:11,length:.075,radius:.016,field,select:(x,y,z)=>y>-.2&&z>-.2});
tufts(head,furMat,{center:[0,-.05,0],radii:[.78,.74,.66],count:500,seed:13,length:.065,radius:.014,field:faceField,select:(x,y,z)=>(y<-.15||Math.abs(x)>.55)&&!(z>.3&&Math.abs(x)<.45)});
// field = the sculpt SDF (negative inside); select gets the unit direction; exclude the muzzle front.
