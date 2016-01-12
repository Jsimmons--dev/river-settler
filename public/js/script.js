var scene = new THREE.Scene();

var types = {'brick':{
			color:0xD77F37
		},
		'lumber':{
			color:0x1A703F
		
		},'wool':{
			color:0x9CC53B
		
		},'grain':{
			color:0xEFB730
		
		},'ore':{
			color:0x96A392
		
		},'desert':{
			color:0xFFEA7A
		}};

function createPiece(type,pos){
	var piece = {type:type, pos:pos};
	return piece;
}

function createRow(types,offset,height){
	var newRow = [];
	types.forEach(function(type,i){
		newRow.push(createPiece(type,[i+offset,height]));
	});
	return newRow;
}

function createBoard(rowArray,offset,height){
		var board = [];
		var y = height;
		rowArray.rowEach(function(d,i){
			createRow(d,offset+i,y);
			y++;
		});
		return board;
}

function createSimpleBoard(pos){
		var board = {};
		board.tiles = [];
		board.tiles.push(createRow(['grain','lumber','wool'],0,0));
		board.tiles.push(createRow(['brick','lumber','grain','lumber'],0,1));
		board.tiles.push(createRow(['ore','grain','desert','grain','wool'],0,2));
		board.tiles.push(createRow(['brick','wool','brick','ore'],1,3));
		board.tiles.push(createRow(['lumber','grain','ore'],2,4));
		return board;

}

var board = createSimpleBoard([0,0]);

var texLoader = new THREE.TextureLoader();

function renderPiece(piece,geom,tex){
	var material = new THREE.MeshPhongMaterial({
		color:types[piece["type"]].color,
		map: tex
	});

	var hex = new THREE.Mesh(geom,material);
	var worldPos = getWorldPos(piece.pos);
	scene.add(hex);
	hex.position.set(worldPos[1],-.85,worldPos[0]);
	hex.scale.set(.9,1,.9);
	return hex;
}

function renderRow(row,geom,tex){
	row.forEach(function(d,i){renderPiece(d,geom,tex)});
}

function getWorldPos(pos){
	return [pos[0]*2-1*pos[1],pos[1]*1.5];
}

function renderBoard(board,geom,tex){
	board.tiles.forEach(function(d,i){
		renderRow(d,geom,tex);	
	});
}

/* Start Shape */
var loader = new THREE.JSONLoader();

loader.load('assets/hex.json',function(geometry,materials){
		texLoader.load('assets/hexTextureGrey.jpg',function(texture){
			renderBoard(board,geometry,texture);
		})
});


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
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1);
				hemiLight.position.set( 0, 500, 0 );
				//scene.add( hemiLight );
var dirLight = new THREE.DirectionalLight(0xffffff);
	dirLight.position.set(0,10,0);
	scene.add(dirLight);

var controls = new THREE.OrbitControls(camera,renderer.domElement);

waterNormals = new THREE.ImageUtils.loadTexture('assets/waternormals.jpg' );
				waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

				water = new THREE.Water( renderer, camera, scene, {
					textureWidth: 512,
					textureHeight: 512,
					waterNormals: waterNormals,
					alpha: 	1.0,
					sunDirection: hemiLight.position.clone().normalize(),
					sunColor: 0xffffff,
					waterColor: 0x001e0f,
					distortionScale: 50.0,
				} );


				mirrorMesh = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 10000, 10000 ),
					water.material
				);

				mirrorMesh.add( water );
				mirrorMesh.rotation.x = - Math.PI * 0.5;
				mirrorMesh.position.y = -1;
				scene.add( mirrorMesh );

function render() {
  //edit shape movements here
  
  //don't touch
  water.material.uniforms.time.value += 1.0 / 60.0;
  water.render();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
/* End shape */

render();
