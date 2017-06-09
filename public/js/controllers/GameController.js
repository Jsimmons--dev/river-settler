import * as canvas from '../view/canvas';
import * as THREE from 'three';
import * as ui from "../ui/ui";
import {context} from '../models/gameContext';
import {Controller} from './Controller';

export class GameController extends Controller{

    constructor(startConfig){
        context.game = new Game({
            playerCount: startConfig.playerCount
        });
        context.gameController = new GameController();
        super();
        this.toggleToolbar = (toolbarId) => {
            document.querySelector('#' + toolbarId).classList.toggle('hide');
        };
    }

    swapBack(){
        ui.navigateBack();
    }

    OnLanding(){
        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 2), 1, 100);

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight / 2);
        renderer.setClearColor(0x0000ff);

        this.canvasNode.appendChild(renderer.domElement);

        let jsonLoader = new THREE.JSONLoader();

        jsonLoader.load('../../assets/hex.json',(geometry, materials)=>{
            let material = new THREE.MeshLambertMaterial();
            let hex = new THREE.Mesh(geometry, material);
            hex.rotation.set(0, Math.PI / 2, 0);
            scene.add(hex);
            function animate(){
                requestAnimationFrame(animate);
                renderer.render(scene, camera); 
            }
            animate();
        });
    }

    OnVisit(){
        console.log('visited');
    }
}
