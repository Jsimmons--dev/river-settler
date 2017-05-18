import * as ui from "../ui/ui";
import * as THREE from 'three';
import * as canvas from '../view/canvas';
import {Controller} from './Controller';

export class StartController extends Controller{

    constructor(){
        super();

        this.baseSpinRate = .02;

        this.swapToOptionsView = () => {
            ui.navigate('options');
        };

        this.navigateNewGame = () => {
            ui.navigate('new');
        };

        this.fadeToOptions = () => {
            let i = 0;
            let maxI = 10;
            let interval = setInterval(() => {
                if(i++ < maxI){
                    this.zRate *= 1.4;
                    this.yRate += .02;
                }
            }, 100)
            setTimeout(() => {
                clearInterval(interval);
                this.zRate = this.baseSpinRate;
                this.yRate = 0;
                this.hex.position.set(0, 0, 0);
                ui.navigate('options');
            }, 1000);
        
        }
    }

    OnLanding(){
        let scene = new THREE.Scene();

        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 2), 1, 100);
        camera.position.set(0,0,5);

        let light = new THREE.PointLight(0xffffff, 1);
        light.position.set(0,0,5);
        scene.add(light);


        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight / 2);
        renderer.setClearColor(0x88ddff);

        this.canvasNode.appendChild(renderer.domElement);

        let jsonLoader = new THREE.JSONLoader();

        jsonLoader.load('../../assets/hex.json',(geometry, materials)=>{
            console.log('loaded hex');
            let material = new THREE.MeshLambertMaterial();
            this.hex = new THREE.Mesh(geometry, material);
            this.hex.rotation.set(Math.PI / 2, 0, 0);
            scene.add(this.hex);
            this.zRate = this.baseSpinRate;
            this.yRate = 0;
            let animate = () => {
               requestAnimationFrame(animate);
               this.hex.rotation.set(this.hex.rotation.x, this.hex.rotation.y, this.hex.rotation.z + this.zRate);
               this.hex.position.set(this.hex.position.x, this.hex.position.y + this.yRate, this.hex.position.z);
               renderer.render(scene, camera); 
            }
            animate();
            });
    }

    OnVisit(){
    }
}
