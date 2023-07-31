import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 边缘几何体 获取边缘方式2
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

export const Phong = () => {
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

    /** 环境光 */
    const ambientLight = new THREE.AmbientLight('green', 0.5)
    /** 点光源 */
    const pointLight = new THREE.PointLight('#FFFFFF', 0.5)
    pointLight.position.set(0,2,0)

    const textureLoader = new THREE.TextureLoader();
    /** 纹理贴图 */
    const colorTexture = textureLoader.load('./texture/watercover/CityNewYork002_COL_VAR1_1K.png');
    colorTexture.colorSpace = THREE.SRGBColorSpace;
    /** 高光贴图 */
    const specularTexture = textureLoader.load("./texture/watercover/CityNewYork002_GLOSS_1K.jpg");
    /** 法线贴图 */
    const normalTexture = textureLoader.load("./texture/watercover/CityNewYork002_NRM_1K.jpg");
    // 凹凸贴图
    const dispTexture = textureLoader.load("./texture/watercover/CityNewYork002_DISP_1K.jpg");
    // 环境光遮蔽贴图
    const aoTexture = textureLoader.load("./texture/watercover/CityNewYork002_AO_1K.jpg");
    const planeGeometry = new THREE.PlaneGeometry(1,1);
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: colorTexture,
        specularMap: specularTexture,
        normalMap:normalTexture,
        // displacementMap: dispTexture,
        // displacementScale: 0.02,
        bumpMap: dispTexture,
        transparent: true,
        aoMap: aoTexture
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI/2
    scene.add(plane, ambientLight, pointLight);









    scene.add(camara, axesHelper);
    /** 环境贴图 - 可以让鸭子亮起来 */
    new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
        // 设置球形映射
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置环境贴图
        // scene.background = envMap;
        scene.environment = envMap;
        // 设置平面材质的环境贴图, 可以看到窗子反射的光
        plane.material.envMap = envMap;
        // material2.envMap = envMap;
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
