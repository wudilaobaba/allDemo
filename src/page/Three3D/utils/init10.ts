import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/***
 * 将立方体的每个面设置为不同的材质
 */
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 专门用来加载hdr
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {reflectVector} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
export const init10 = () => {
  /** 创建场景 */
  const scene = new THREE.Scene();
  /** 创建相机 */
  const camara = new THREE.PerspectiveCamera(
    75, // 眼睛睁开的最大角度
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  /** 设置相机位置 */
  camara.position.set(0, 0, 10);
  camara.lookAt(0, 0, 1);

  /** 初始化渲染器 */
  const render = new THREE.WebGLRenderer();
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


  // 纹理加载器
  const textTureLoader = new THREE.TextureLoader();
  /** 纹理贴图 */
  const textTure = textTureLoader.load('./texture/watercover/CityNewYork002_COL_VAR1_1K.png');
  textTure.colorSpace = THREE.SRGBColorSpace; // 这样更符合人眼
  /** ao贴图 就是夹缝的纹理更加深*/
  const aoMap = textTureLoader.load('./texture/watercover/CityNewYork002_AO_1K.jpg')
  /** 透明度贴图 - 黑白灰色 白色全透明 黑色不透明 灰色半透明 */
  const alphaMap = textTureLoader.load('./texture/door/height.jpg')
  /** 光照贴图 */
  const lightMap = textTureLoader.load('./texture/colors.png')
  /** 环境贴图 */
  new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',(envMap)=>{
    // 设置球星映射
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.background = envMap;
    scene.environment = envMap;
    // 设置平面的环境贴图, 可以看到窗子反射的光
    planeMaterial.envMap = envMap;
  })

  // 创建平面几何体
  const planeGeometry = new THREE.PlaneGeometry(1,1);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: "#FFFFFF",
    transparent: true, // 允许透明 png图片
    aoMap,
    alphaMap,
    lightMap,
    reflectivity: 0.5, // 设置平面反射强度
    // map: textTure // 两种设置方式 方式1
  })
  planeMaterial.map = textTure; // 方式2
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(camara,plane, axesHelper); // 将相机添和物体加到场景中
  // 监听窗口变化
  window.addEventListener('resize',()=>{
    // 重置渲染器高度比
    render.setSize(window.innerWidth, window.innerHeight);
    // 重置相机宽高比
    camara.aspect = window.innerWidth/window.innerHeight;
    // 更新相机投影矩阵
    camara.updateProjectionMatrix();
  });
  const renderFun: FrameRequestCallback = () => {
    controller.update();
    render.render(scene, camara);
    requestAnimationFrame(renderFun);
  };
  renderFun(0);


  const gui = new GUI();
  gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name('AO贴图强度')
  gui.add(textTure, "colorSpace",{
    sRGB: THREE.SRGBColorSpace,
    linear: THREE.LinearSRGBColorSpace,
  }).onChange(val=>textTure.needsUpdate = true); // 修改后更新
};
