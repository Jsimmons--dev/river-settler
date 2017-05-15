import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

export function init(element) {

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(5, 9, 2);
    camera.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);

    console.log(camera);

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x88ddff);

    let controls = new OrbitControls(camera, renderer.domElement);

    let dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 100, 0);
    scene.add(dirLight);
    
    let jsonLoader = new THREE.JSONLoader();

    jsonLoader.load('../../assets/hex.json',(geometry, materials)=>{
        let material = new THREE.MeshBasicMaterial();
        let hex = new THREE.Mesh(geometry, material);

        hex.rotation.set(0, Math.PI / 2, 0);
        hex.scale.set(.48, .5, .48);
        scene.add(hex);
    });


    element.appendChild( renderer.domElement );

    function animate(){
        requestAnimationFrame( animate );

//        mesh.rotation.x += 0.01;
//        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }

    return {
        scene,
        camera,
        renderer,
        animate
    }
}
