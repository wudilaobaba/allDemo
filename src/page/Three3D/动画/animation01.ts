import * as THREE from "three";
import * as gsap from "gsap";
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

export const animation01 = () => {
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
        alpha: true
    });
    /** 渲染器大小设置 */
    render.setSize(window.innerWidth, window.innerHeight);
    const threeCanvas = render.domElement;
    threeCanvas.style.position = 'fixed'
    threeCanvas.style.top = '0'
    threeCanvas.style.left = '0'
    document.body.insertBefore(threeCanvas, document.getElementById("root"));
    // const controller = new OrbitControls(camara, threeCanvas);
    // controller.enableDamping = true; // 阻尼，有惯性，看起来更加真实
    // controller.dampingFactor = 0.01; // 设置阻尼系数，越小惯性越大
    // controller.autoRotate = true; // 轨道自动旋转
    /** 创建辅助坐标系 */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(camara, axesHelper)
    const gltfLoader = new GLTFLoader();
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
    const cubeGeomatry = new THREE.BoxGeometry(1,1,1);
    const cubeMaterial = new THREE.MeshBasicMaterial({
        color:"#F00"
    })
    const cube = new THREE.Mesh(cubeGeomatry, cubeMaterial);
    scene.add(cube)
    const pGeomatry = new THREE.BoxGeometry(2,2,2);
    const pMaterial = new THREE.MeshBasicMaterial({color:"black"});
    const p = new THREE.Mesh(pGeomatry, pMaterial);
    p.position.y = -30;
    scene.add(p)
    const xGeomatry = new THREE.BoxGeometry(10,10,10);
    const xMaterial = new THREE.MeshBasicMaterial({color:"pink"});
    const x = new THREE.Mesh(xGeomatry, xMaterial);
    x.position.y = -60;
    scene.add(x)
    // 监听窗口变化
    window.addEventListener('resize', () => {
        // 重置渲染器高度比
        render.setSize(window.innerWidth, window.innerHeight);
        // 重置相机宽高比
        camara.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        camara.updateProjectionMatrix();
    });
    window.addEventListener('scroll',()=>{
        const currentPage = Math.round(window.scrollY/window.innerHeight)
        console.log(currentPage)
        camara.position.y = -(window.scrollY/window.innerHeight*30)
    })

    const renderFun: FrameRequestCallback = () => {
        // controller.update();
        render.render(scene, camara);
        requestAnimationFrame(renderFun);
        gsap.gsap.to(cube.position,{x: 5, duration:4}); // 4s
        gsap.gsap.to(cube.rotation,{x: 2 * Math.PI, duration:4}); // 4s
    };
    renderFun(0);



};
