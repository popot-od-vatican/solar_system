import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const fbxLoader = new FBXLoader();

export let spaceShip1: any;
export let spaceShip2: any;

function calculateDistance(xObj: any, yObj: any, middlePoint: any = null)
{
    if(middlePoint === null)
    {
        const x: any = new THREE.Vector3();
        const y: any = new THREE.Vector3();

        xObj.getWorldPosition(x);
        yObj.getWorldPosition(y);

        const dx = x.x - y.x;
        const dy = x.y - y.y;
        const dz = x.z - y.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    else
    {
        const x: any = new THREE.Vector3();
        xObj.getWorldPosition(x);

        const dx = x.x - middlePoint.x;
        const dy = x.y - middlePoint.y;
        const dz = x.z - middlePoint.z;
        
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

class ship
{
    public targetPlanet: any;
    public startingPlanet: any;
    public targetPosition: any = new THREE.Vector3();
    public startingPosition: any = new THREE.Vector3();
    public object: any;
    public speed: number;
    public middlePoint: any = new THREE.Vector3();
    public finished: boolean = false;
    public travelling: boolean = false;
    public finishedMiddlePoint: boolean = false;

    constructor(object: any, speed: number)
    {
        this.object = object;
        this.speed = speed;
    }

    setStartingBase(target: any): void
    {
        this.startingPlanet = target;
    }

    setTargetBase(target: any): void
    {
        this.targetPlanet = target;
    }

    getTargetPlanetPosition(): void
    {
        this.targetPlanet.bodyMesh.getWorldPosition(this.targetPosition);
    }

    getStartingPlanetPosition(): void
    {
        this.startingPlanet.bodySystem.getWorldPosition(this.startingPosition);
    }

    startJourney(): void
    {
        this.travelling = true;
        this.finished = false;
        this.finishedMiddlePoint = false;

        this.getStartingPlanetPosition();
        this.getTargetPlanetPosition();

        this.middlePoint.x = (this.startingPosition.x+this.targetPosition.x)/2;
        this.middlePoint.y = 40;
        this.middlePoint.z = (this.startingPosition.z+this.targetPosition.z)/2;
        this.object.lookAt(this.middlePoint.x, this.middlePoint.y, this.middlePoint.z);
        this.object.position.set(this.startingPosition.x, this.startingPosition.y, this.startingPosition.z);
    }

    update(): void
    {
        if(this.travelling)
        {
            if(this.targetPlanet == this.startingPlanet)
            {
                this.finished = true;
                return;
            }
            if(this.targetPlanet !== null && this.startingPlanet !== null)
            {
                if(calculateDistance(this.object, null, this.middlePoint) >= 2.5 && !this.finishedMiddlePoint)
                {
                    this.object.lookAt(this.middlePoint);
                    const moveDirection = new THREE.Vector3();
                    this.object.getWorldDirection(moveDirection);
                    moveDirection.multiplyScalar(this.speed);
                    this.object.position.add(moveDirection);
                }
                else if(calculateDistance(this.object, this.targetPlanet.bodySystem) >= 1.0)
                {
                    this.finishedMiddlePoint = true;
                    this.getTargetPlanetPosition();
                    this.object.lookAt(this.targetPosition);
                    const moveDirection = new THREE.Vector3();
                    this.object.getWorldDirection(moveDirection);
                    this.object.position.add(moveDirection);
                }
                else
                {
                    console.log('Finished Destination!');
                    this.finished = true;
                    this.travelling = false;
                    this.object.visible = false;
                }
            }
        }
    }
}

export function loadModel(): any
{
    return new Promise((resolve, reject) => {
        const first = fbxLoader.load('./static/3D models/spaceShip1.fbx', (object)=>{
            for(let i = 0; i < object.children.length; ++i)
            {
                if(object.children[i] instanceof THREE.PointLight)
                {
                    object.remove(object.children[i]);
                }
            }
            object.scale.set(0.012, 0.012, 0.012);
            spaceShip1 = new ship(object, 0.09); 
            resolve('success');
        });
    });
   return 0;
}

