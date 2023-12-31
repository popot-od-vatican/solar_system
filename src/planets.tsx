import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

function calculateDistance(object: any, camera: any)
{
    const vec3: any = new THREE.Vector3();
    const cameraPosition = camera.position;
    object.getWorldPosition(vec3);
    const distance = cameraPosition.distanceTo(vec3);
    return distance;
}

class CelestialBody
{
    public radius: number;
    public widthSeg: number;
    public heightSeg: number;
    public labelColor: string;
    public name: string;
    public pos: [number, number, number];
    public axisSpeed: [number, number, number];
    public div: HTMLDivElement;
    public label: any;
    public bodyMesh: any;
    public bodyOrbit: any;
    public bodySystem: any;

    constructor(scene: any, radius: number, widthSeg: number, heightSeg: number, material: any, label: string, labelColor: string,
        pos: [number, number, number] = [0, 0, 0], axisSpeed: [number, number, number] = [0, 0, 0], labelClass: string = '')
    {
        this.radius = radius;
        this.widthSeg = widthSeg;
        this.heightSeg = heightSeg;
        this.labelColor = labelColor;
        this.pos = pos;
        this.axisSpeed = axisSpeed;
        this.name = label;

        // Kreira sphere so texture
        const bodyGeo = new THREE.SphereGeometry(radius, this.widthSeg, this.heightSeg);
        this.bodyMesh = new THREE.Mesh(bodyGeo, material);
        this.bodyMesh.name = label;

        // Se koristi za kreiranje na label na teloto
        this.div = document.createElement('div');
        this.div.className = labelClass;
        this.div.textContent = `[ ${label} ]`;
        this.div.style.backgroundColor = 'transparent';
        this.div.style.color = labelColor;
        this.label = new CSS2DObject(this.div);
        this.label.position.set(0, 3.0, 0 );
        this.label.center.set(0, 0);
        this.label.layers.set(0);

        // potrebno za orbita i dr!!!!
        // I plus labelot da ne rotira okolu svojata oskata
        this.bodyOrbit = new THREE.Object3D();
        // Za da moze da i se dodadat sateliti
        this.bodySystem = new THREE.Object3D();
        this.bodySystem.add(this.bodyMesh);
        this.bodySystem.add(this.label);
        this.bodyOrbit.add(this.bodySystem);
        this.bodySystem.position.set(pos[0], pos[1], pos[2]);
        this.bodyOrbit.position.set(0, 0, 0);

        scene.add(this.bodyOrbit);
    }

    update(): void
    {
        // Se vrti okolu svoite oski so dadenite brzini
        this.bodyMesh.rotateX(this.axisSpeed[0]);
        this.bodyMesh.rotateY(this.axisSpeed[1]);
        this.bodyMesh.rotateZ(this.axisSpeed[2]);
    }
}

export class Star extends CelestialBody
{
    // Moze da se upotreba ako se dvizi nekade sonceto
    public orbitSpeed: [number, number, number];

    constructor(scene: any, radius: number, widthSeg: number, heightSeg: number, material: any, label: string, labelColor: string,
        pos: [number, number, number] = [0, 0, 0], axisSpeed: [number, number, number] = [0, 0, 0], orbitSpeed: [number, number, number],
        labelClass: string = 'star-label')
    {
        super(scene, radius, widthSeg, heightSeg, material, label, labelColor, pos, axisSpeed, labelClass);
        this.orbitSpeed = orbitSpeed;
        this.bodyMesh.castShadow = true;
        this.bodyMesh.receiveShadow = false;
    }

    update(): void
    {
        super.update();
    }
}

export class Planet extends CelestialBody
{
    public orbitSpeed: [number, number, number];
    public ringMesh: any = null;
    public star: any = null;
    public cloudsMesh: any = null;
    public cloudAxisSpeed: any = null;
    public labelBase: any = null;
    public satelliteLabels: any[] = [];
    public baseMesh: any;

    constructor(scene: any, star: Star | Planet, radius: number, widthSeg: number, heightSeg: number, material: any, label: string, labelColor: string,
        pos: [number, number, number], axisSpeed: [number, number, number] = [0, 0, 0], orbitSpeed: [number, number, number] = [0, 0, 0],
        labelClass: string = 'planet-label')
    {
        super(scene, radius, widthSeg, heightSeg, material, label, labelColor, pos, axisSpeed, labelClass);
        this.star = star;
        this.orbitSpeed = orbitSpeed;
        this.label.center.set(0, 1);

        const points = [];

        for(let i = 0; i <= 360; ++i)
        {
            points.push(new THREE.Vector3(Math.cos(i*(Math.PI/180))*pos[0], pos[1], Math.sin(i*(Math.PI/180))*pos[0]));
        }

        const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMat = new THREE.LineBasicMaterial({color: 0x0A96A0, linewidth: 1.0});
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        if(star instanceof Planet)
        {
            star.satelliteLabels.push(this.label);
        }
        star.bodySystem.add(orbitLine);
        star.bodySystem.add(this.bodyOrbit);
    }

    addRing(innerRadius: number, outerRadius: number, thetaSegments: number, ringRotation: [number, number, number], material: any): void
    {
        const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);

        this.ringMesh = new THREE.Mesh(ringGeo, material);
        this.ringMesh.position.set(this.bodyMesh.position.x, this.bodyMesh.position.y, this.bodyMesh.position.z);
        this.ringMesh.rotateX(ringRotation[0]);
        this.ringMesh.rotateY(ringRotation[1]);
        this.ringMesh.rotateZ(ringRotation[2]);
        this.bodySystem.add(this.ringMesh);
    }

    addClouds(cloudsMaterial: any, cloudAxisSpeed: [number, number, number]): void
    {
        const cloudsGeo = new THREE.SphereGeometry(this.radius*1.01, this.widthSeg, this.heightSeg);
        this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMaterial);
        this.cloudsMesh.name = "Earth Clouds";
        this.cloudAxisSpeed = cloudAxisSpeed;
        this.bodySystem.add(this.cloudsMesh);
    }

    addBase(color: string, position: [number, number, number])
    {
        const baseGeo = new THREE.SphereGeometry(0.26, 10, 10);
        const baseMat = new THREE.MeshBasicMaterial({color: color});
        this.baseMesh = new THREE.Mesh(baseGeo, baseMat);

        const divBase = document.createElement('div');
        divBase.className = 'base-label';
        divBase.textContent = `[ Base ]`;
        divBase.style.backgroundColor = 'transparent';
        divBase.style.color = color;
        this.labelBase = new CSS2DObject(divBase);
        this.labelBase.position.set(0, 0.0, 0 );
        this.labelBase.center.set(0, 0);
        this.labelBase.layers.set(0);

        this.baseMesh.position.set(position[0], position[1], position[2]);
        this.baseMesh.add(this.labelBase);
        this.bodyMesh.add(this.baseMesh);
    }

    update(): void
    {
        super.update();
        // Za orbitata moze da rotira vo 3 oski
        this.bodyOrbit.rotateX(this.orbitSpeed[0]);
        this.bodyOrbit.rotateY(this.orbitSpeed[1]);
        this.bodyOrbit.rotateZ(this.orbitSpeed[2]);

        if(this.cloudsMesh !== null)
        {
            this.cloudsMesh.rotateX(this.cloudAxisSpeed[0]);
            this.cloudsMesh.rotateY(this.cloudAxisSpeed[1]);
            this.cloudsMesh.rotateZ(this.cloudAxisSpeed[2]);
        }
    }

    updateBaseLabelVisibility(camera: any): void
    {
        if(this.labelBase !== null)
        {
            if(calculateDistance(this.labelBase, camera) >= 150)
            {
                this.labelBase.visible = false;
            }
            else
            {
                this.labelBase.visible = true;
            }
        }
    }

    updateSatellitesLabelVisibility(camera: any): void
    {
        if(this.satelliteLabels.length >= 1)
        {
            for(let i = 0; i < this.satelliteLabels.length; ++i)
            {
                if(calculateDistance(this.satelliteLabels[i], camera) >= 390)
                {
                    this.satelliteLabels[i].visible = false;
                }
                else
                {
                    this.satelliteLabels[i].visible = true;
                }
            }
        }
    }

    updateSelfLabelVisibility(camera: any): void
    {
        if(calculateDistance(this.label, camera) >= 2000)
        {
            this.label.visible = false;
        }
        else
        {
            this.label.visible = true;
        }
    }
}
