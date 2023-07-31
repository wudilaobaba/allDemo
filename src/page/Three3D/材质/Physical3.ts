import * as THREE from "three";
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

export const Physical3 = () => {
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
    camara.position.set(2, 2, 15);
    camara.lookAt(0, 0, 1);

    /** 初始化渲染器 */
    const render = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿
    });
    /** 渲染器大小设置 */
    render.setSize(window.innerWidth, window.innerHeight);
    const threeCanvas = render.domElement;
    document.body.insertBefore(threeCanvas, document.getElementById("root"));
    const controller = new OrbitControls(camara, threeCanvas);
    controller.enableDamping = true; // 阻尼，有惯性，看起来更加真实
    controller.dampingFactor = 0.01; // 设置阻尼系数，越小惯性越大
    // controller.autoRotate = true; // 轨道自动旋转
    /** 创建辅助坐标系 */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(camara, axesHelper)
    let thicknessMap = new THREE.TextureLoader().load(
        "./texture/diamond/diamond_emissive.png"
    );

    let normalMap = new THREE.TextureLoader().load(
        "./texture/diamond/diamond_normal.png"
    );

    let carbonNormal = new THREE.TextureLoader().load(
        "./texture/carbon/Carbon_Normal.png"
    );

    let scratchNormal = new THREE.TextureLoader().load(
        "./texture/carbon/Scratched_gold_01_1K_Normal.png"
    );

    let sofaNormal = new THREE.TextureLoader().load("./texture/sofa/normal.png");

    let brickRoughness = new THREE.TextureLoader().load(
        "./texture/brick/brick_roughness.jpg"
    );

    let brickColor = new THREE.TextureLoader().load(
        "./texture/brick/brick_diffuse.jpg"
    );
    new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap=>{
        // 创建球几何体
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
        // 创建球材质
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.05,
            transmission: 1,
            thickness: 0.1,
            iridescence: 1, // 虹彩效应
            reflectivity: 1,// 反射绿
            iridescenceIOR: 1.3, // 虹彩折射率
            iridescenceThicknessRange: [100, 400],
            iridescenceThicknessMap: brickRoughness,
        });
        // 创建球体
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        // 设置球形映射
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置大环境背景
        scene.background = envMap;

        scene.environment = envMap; /** 这里是重点
         /**。设置所有模型的环境贴图, 可以看到窗子反射的光 */
        sphere.material.envMap = envMap;
    })


    // 监听窗口变化
    window.addEventListener('resize', () => {
        // 重置渲染器高度比
        render.setSize(window.innerWidth, window.innerHeight);
        // 重置相机宽高比
        camara.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        camara.updateProjectionMatrix();
    });
    const renderFun: FrameRequestCallback = () => {
        controller.update();
        render.render(scene, camara);
        requestAnimationFrame(renderFun);
    };
    renderFun(0);

};
