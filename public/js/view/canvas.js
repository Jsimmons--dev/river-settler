import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';

export function init({element, isCamera = true, 
    cameraPosition = {x:0, y:0, z:0}, cameraRotation = {x:0, y:0, z:0}, 
    clearColor= 0x88ddff, isControlled = true}) {

    let scene = new THREE.Scene();

    let camera;
    if(isCamera){
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        //5,9,2
        camera.rotation.set(cameraRotation.x, cameraRotation.y, cameraRotation.z);
        //-Math.PI/2,0,-Math.PI/2
    }

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(clearColor);

    let controls;
    if(isControlled){
        controls = new OrbitControls(camera, renderer.domElement);
    }

    element.appendChild( renderer.domElement );

    let animations = [];
    function animationSubscribe(action){
        animations.push(action); 
    }
    function animate(){
        requestAnimationFrame( animate );
        for(let animation of animations){
            animation(); 
        }
        renderer.render( scene, camera );

    }

    return {
        scene,
        camera,
        renderer,
        animations,
        animationSubscribe,
        animate
    }
}
