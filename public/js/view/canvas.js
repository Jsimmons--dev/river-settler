import * as THREE from 'three';

export function init(element) {

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    let geometry = new THREE.BoxGeometry( 200, 200, 200 );
    let material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    let mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    element.appendChild( renderer.domElement );

    function animate(){
        requestAnimationFrame( animate );

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;

        renderer.render( scene, camera );

    }

    return {
        scene,
        camera,
        renderer,
        geometry,
        material,
        mesh,
        animate
    }
}
