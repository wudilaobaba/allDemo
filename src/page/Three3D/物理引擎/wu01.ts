import * as THREE from "three";
import * as CANNON from 'cannon-es'
// 【轨道控制器】 子元素实际上是以父元素为参照的
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 标准网格材质 - 彩虹效应
 */
// 补间动画的库
import {Tween, Easing} from 'three/examples/jsm/libs/tween.module'
// GLTF加载器 加载gltf文件
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
// hdr加载器 专门用来加载hdr
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {reflectVector} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
import {MeshBasicMaterial} from "three";
import {MouseEvent} from "react";
import {Simulate} from "react-dom/test-utils";
import cut = Simulate.cut;

export const wu01 = () => {
    /** 创建场景 */
    const scene = new THREE.Scene();
    /** 创建相机 */
    const camara = new THREE.PerspectiveCamera(
        75, // 眼睛睁开的最大角度
        window.innerWidth / window.innerHeight,
        0.1, // 近平面
        1000, // 远平面
    );
    /** 设置相机位置 */
    camara.position.set(0, 0, 15);
    camara.lookAt(0, 0, 1);

    /** 初始化渲染器 */
    const render = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
        // alpha: true
    });
    /** 渲染器大小设置 */
    render.setSize(window.innerWidth, window.innerHeight);
    const threeCanvas = render.domElement;
    threeCanvas.style.position = 'fixed'
    threeCanvas.style.top = '0'
    threeCanvas.style.left = '0'
    document.body.insertBefore(threeCanvas, document.getElementById("root"));
    const controller = new OrbitControls(camara, threeCanvas);
    controller.enableDamping = true; // 阻尼，有惯性，看起来更加真实
    controller.dampingFactor = 0.01; // 设置阻尼系数，越小惯性越大
    controller.autoRotate = false; // 轨道自动旋转
    /** 创建辅助坐标系 */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(camara, axesHelper)
    const sphereGeometry = new THREE.SphereGeometry(1,20,20);
    const sphereMaterial = new THREE.MeshStandardMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere)
    const planeGeometry = new THREE.PlaneGeometry(10,10);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const floor = new THREE.Mesh(planeGeometry, planeMaterial);
    floor.rotation.x = -Math.PI/2
    floor.position.y = -4
    scene.add(floor)
    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff,0.5);
    render.shadowMap.enabled = true
    dirLight.castShadow = true
    floor.receiveShadow = true;
    sphere.castShadow = true;
    scene.add(ambientLight, dirLight)
    const gltfLoader = new GLTFLoader();
    /** 创建物理世界 */
    const world = new CANNON.World();
    world.gravity.set(0,-9.8,0);// 设置重力
    // 物理世界小球
    const sphereShape = new CANNON.Sphere(1);
    const sphereWorldMaterial = new CANNON.Material('default');
    const sphereBody = new CANNON.Body({
        shape: sphereShape,
        position: new CANNON.Vec3(0,0,0),
        mass:1, // 小球质量
        material: sphereWorldMaterial
    });
    const fit = (e: any)=>{
        // 碰撞强度
        const impactStrength: number = e.contact.getImpactVelocityAlongNormal()
        console.log(impactStrength)
    }
    // 监听碰撞事件
    sphereBody.addEventListener('collide',fit)
    world.addBody(sphereBody);

    // 物理世界地面
    const planeShape = new CANNON.Plane();
    const planeWorldMaterial = new CANNON.Material('floor');
    const planeBody = new CANNON.Body({
        shape: planeShape,
        position: new CANNON.Vec3(0,-4,0),
        mass:0, // 小球质量
        material: planeWorldMaterial
    });
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
    // 两种材质的关联
    const defaultContactMaterial = new CANNON.ContactMaterial(sphereWorldMaterial, planeWorldMaterial,{
        friction: 0.1, // 摩擦系数
        restitution: 0.7 //弹性
    })
    world.addBody(planeBody);
    world.addContactMaterial(defaultContactMaterial)

    // new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap=>{
    //     // 设置球形映射
    //     envMap.mapping = THREE.EquirectangularReflectionMapping;
    //     // 设置大环境背景
    //     scene.background = envMap;
    //
    //     scene.environment = envMap; /** 这里是重点
    //      /**。设置所有模型的环境贴图, 可以看到窗子反射的光 */
    //
    // })
    // 监听窗口变化
    window.addEventListener('resize', () => {
        // 重置渲染器高度比
        render.setSize(window.innerWidth, window.innerHeight);
        // 重置相机宽高比
        camara.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        camara.updateProjectionMatrix();
    });
    const clock = new THREE.Clock();
    const renderFun: FrameRequestCallback = () => {
        controller.update();
        render.render(scene, camara);
        requestAnimationFrame(renderFun);
        const deltaTime = clock.getDelta(); // 两帧之间的时间差
        world.step(1/120, deltaTime);
        // @ts-ignore
        sphere.position.copy(sphereBody.position)
        // @ts-ignore
        // floor.position.copy(planeBody.position)
    };
    renderFun(0);



};
