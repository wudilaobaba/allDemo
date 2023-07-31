import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 标准网格材质
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

export const Physical = () => {
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
    const textureLoader = new THREE.TextureLoader();
    const thicknessMap = textureLoader.load('./texture/diamond/diamond_emissive.png')
    scene.add(camara, axesHelper);
    new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',(envMap)=>{
        // 设置球形映射
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        // 设置大环境背景
        scene.background = envMap;
        scene.environment = envMap; /** 这里是重点
         /**。设置所有模型的环境贴图, 可以看到窗子反射的光 */
        // plant.material.envMap = envMap;
        const cubeGeometry = new THREE.BoxGeometry(1,1,1,);
        const cubeMaterial = new THREE.MeshPhysicalMaterial({
            transparent: true, // 允许透明
            transmission: 1.0, // 完全透明 // 0.0～1.0
            roughness: 0, // 完全光滑
            thickness: 2, // 厚度-为了有折射效果 默认0
            attenuationColor: new THREE.Color(0.6, 0, 0),// 衰减颜色，吸收掉的颜色 不要设置纯色
            attenuationDistance: 2,// 衰减距离 密度的意思
            thicknessMap, // 厚度贴图实现厚度 百1 黑0
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        scene.add(cube);
        gui.add(cube.material,'attenuationDistance', 0, 10).name('衰减距离')
        // gui.add(cube.material,'thickness', 0, 2).name('厚度')
        gui.add(cube.material ,'ior', 0, 2).name('折射率');
        gui.add(cube.material ,'reflectivity', 0, 1).name('反射率');
    })

    const gui = new GUI();


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
