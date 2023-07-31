import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 实现玻璃材质
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

export const Phong1 = () => {
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


    scene.add(camara, axesHelper);
    /** 环境贴图 - 可以让鸭子亮起来 */
    new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', (envMap) => {
        // 设置球形映射
        // envMap.mapping = THREE.EquirectangularReflectionMapping; // 反射
        envMap.mapping = THREE.EquirectangularRefractionMapping; // 折射
        // 设置环境贴图
        // scene.background = envMap;
        scene.environment = envMap;
        // 设置平面材质的环境贴图, 可以看到窗子反射的光
        // plane.material.envMap = envMap;
        // material2.envMap = envMap;


        // 将整个模型的加载放在环境贴图的回调函数中
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('./model/Duck.glb', (gltf)=>{
            const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.5)
            const pointLight = new THREE.PointLight('#FFFFFF', 0.5)
            pointLight.position.set(0,2,0);
            scene.add(gltf.scene, ambientLight, pointLight)
            const duckMesh: any = gltf.scene.getObjectByName('LOD3spShape');
            const preMaterial = duckMesh.material
            duckMesh.material = new THREE.MeshPhongMaterial({
                // color:'pink', // 会影响原有贴图
                refractionRatio: 0.7, // 折射率
                reflectivity: 0.99, // 反射系数 - 也就是反光强烈度
                envMap,
                map: preMaterial.map
            })

        })

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
