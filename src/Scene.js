import React from "react";
import * as THREE from "three";
import { Math } from "three";
import OrbitControls from "orbit-controls-es6";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TweenMax from "gsap";

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgrounds: {},
      renderer: {
        gamma: {
          gammaFactor: 1.8,
          gammaOutput: true,
          gammaInput: true
        }
      },
      controls: {
        max: 100,
        min: 20
      },
      camera: {
        fov: 35,
        near: 0.1,
        far: 100,
        position: { x: 0, y: 0, z: 40 }
      }
    };
  }
  createScene = color => {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(color);
  };
  createCamera = (fov, aspect, near, far, pos) => {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(pos.x, pos.y, pos.z);
    this.camera.rotateOnAxis(new THREE.Vector3(0, 100, 0));
  };
  addControls = (max, min) => {
    const controls = new OrbitControls(this.camera, this.mount);
    this.controls = controls;
    controls.enabled = true;
    controls.maxDistance = max;
    controls.minDistance = min;
  };
  createRenderer = (width, height, gamma) => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.gammaFactor = gamma.gammaFactor;
    this.renderer.gammaOutput = gamma.gammaOutput;
    this.renderer.gammaInput = gamma.gammaInput;
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
  };
  addLight(type, color, intensity, position) {
    if (type === "d") this.light = new THREE.DirectionalLight(color, intensity);
    if (type === "a") this.light = new THREE.AmbientLight(color, intensity);
    this.light.position.set(position.y, position.x, position.z);
    this.scene.add(this.light);
  }
  createSphere = (name, parent, geometry, material, position, rotation) => {
    this[name] = new THREE.Mesh(geometry);
    this[name].material = material;
    if (position) this[name].position.set(position.y, position.x, position.z);
    if (rotation)
      this[name].rotation.set(
        Math.degToRad(rotation.x),
        Math.degToRad(rotation.y),
        Math.degToRad(rotation.z)
      );
    this[parent].add(this[name]);
  };
  createTorus = (name, parent, geometry, material, position, rotation) => {
    this[name] = new THREE.Mesh(geometry);
    this[name].material = material;
    if (position) this[name].position.set(position.y, position.x, position.z);
    if (rotation)
      this[name].rotation.set(
        Math.degToRad(rotation.x),
        Math.degToRad(rotation.y),
        Math.degToRad(rotation.z)
      );
    this[parent].add(this[name]);
  };
  loadGLTF = () => {
    var loader = new GLTFLoader();
    loader.crossOrigin = true;
    loader.load(
      "https://cdn.rawgit.com/KhronosGroup/glTF-Sample-Models/9176d098/1.0/Duck/glTF/Duck.gltf",
      gltf => {
        const model = gltf.scene;

        model.position.set(0, 0, 0);

        TweenMax.from(model.position, 3, {
          y: -8,
          yoyo: true,
          repeat: -1,
          ease: "Power2.easeInOut"
        });

        this.scene.add(model);
        // gltf.animations; // Array<THREE.AnimationClip>
        // gltf.scene; // THREE.Scene
        // gltf.scenes; // Array<THREE.Scene>
        // gltf.cameras; // Array<THREE.Camera>
        // gltf.asset; // Object
      },
      // called while loading is progressing
      function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function(error) {
        console.log("An error happened", error);
      }
    );
  };
  componentDidMount() {
    // SET RENDER SIZES
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    const aspect = width / height;
    // CREATE SCENE
    this.createScene("black");
    // CREATE CAMERA
    this.createCamera(
      this.state.fov,
      aspect,
      this.state.near,
      this.state.far,
      this.state.camera.position
    );
    // ADD CONTROLS
    this.addControls(this.state.controls.max, this.state.controls.min);
    // ADD RENDERER
    this.createRenderer(width, height, this.state.renderer.gamma);
    //ADD LIGHTS
    this.addLight("d", "red", 0.5, { x: 30, y: 50, z: 10 });
    // ADD SUBJECTS
    this.createSphere(
      "nucleus",
      "scene",
      new THREE.SphereBufferGeometry(3, 100, 100),
      new THREE.MeshToonMaterial(),
      { x: 0, y: 0, z: 0 }
    );
    // TWEEN
    TweenMax.from(this.nucleus.position, 3, {
      y: 3,
      yoyo: true,
      repeat: -1,
      ease: "Power2.easeInOut"
    });
    // LAUNCH
    this.LAUNCH();
  }
  LAUNCH = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
    window.addEventListener("resize", e => {
      this.onWindowResize(e);
    });
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };
  onWindowResize = () => {
    // update aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    // update frustum
    this.camera.updateProjectionMatrix();
    // update renderer and canvas
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };
  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);
    this.renderScene();
  };
  render() {
    return (
      <div
        className="Scene"
        style={{ width: "100vw", height: "100vh" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Scene;
