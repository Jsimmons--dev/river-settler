var scene = new THREE.Scene();

var tiles = [];

function createPiece(geom,color,pos){
	var material = new THREE.MeshPhongMaterial({
		color:color
	});
	var hex = new THREE.Mesh(geom,material);
	var worldPos = getWorldPos(pos);
	scene.add(hex);
	hex.rotation.set(0,0,0);
	hex.position.set(worldPos[1],0,worldPos[0]);
	return hex;
}

function getWorldPos(pos){
	return [pos[0]*2-1*pos[1],pos[1]*1.5];
}

/* Start Shape */
var loader = new THREE.JSONLoader();

loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/323345/hex.json',function(geom,materials){
        [0x00ddff,0x00ddff,0xff0000].forEach(function(d,i){ tiles.push(createPiece(geom,d,[i,0])) });
    [0x00ff00,0x00ff00,0x00ffff,0x000000].forEach(function(d,i){ tiles.push(createPiece(geom,d,[i,1])) });
[0x000000,0x000000,0x000000,0x000000,0x000000].forEach(function(d,i){ tiles.push(createPiece(geom,d,[i,2])) });
    [0x000000,0x000000,0x000000,0x000000].forEach(function(d,i){ tiles.push(createPiece(geom,d,[i+1,3])) });
        [0x000000,0x000000,0x000000].forEach(function(d,i){ tiles.push(createPiece(geom,d,[i+2,4])) });
});

function render() {
  //edit shape movements here
//  tiles.forEach(function(tile,i){
//  	if(tile){
//		tile.rotation.y +=.05;
//	}
 // });
  
  //don't touch
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
/* End shape */

var camera = new THREE.PerspectiveCamera(75,
  window.innerWidth / window.innerHeight,
  .1,
  1000);
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x88ddff);
renderer.setSize(window.innerWidth * .985,
  window.innerHeight * .98);
document.body.appendChild(renderer.domElement);
camera.position.set(5,9,2);
camera.rotation.set(-Math.PI/2,0,-Math.PI/2);
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, .8);
				hemiLight.position.set( 0, 500, 0 );
				//scene.add( hemiLight );
var dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(0,10,0);
	scene.add(dirLight);
var geometry = new THREE.PlaneGeometry( 10000, 10000);
var material = new THREE.MeshPhongMaterial( {color: 0x0099ff, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.rotation.set(Math.PI/2,0,0);
plane.position.y = -1;
scene.add( plane );

render();
