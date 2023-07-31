import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * GLTF加载器
 */
// GLTF加载器 加载gltf文件
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
// hdr加载器 专门用来加载hdr
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {reflectVector} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
export const init12 = () => {
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
  camara.position.set(0, 0, 8);
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
  scene.add(camara, axesHelper); // 将相机添和物体加到场景中

  const gltfLoader= new GLTFLoader();
  gltfLoader.load('./model/Duck.glb', (gltf)=>{
    scene.add(gltf.scene)
  })
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./draco/');

  gltfLoader.load('./model/city.glb', (gltf)=>{
    scene.add(gltf.scene)
  })
  // 设置gltf加载器的解码器 解压
  gltfLoader.setDRACOLoader(dracoLoader);
  /** 环境贴图 - 可以让鸭子亮起来 */
  new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',(envMap)=>{
    // 设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    // scene.background = envMap;
    scene.environment = envMap;
    // 设置平面的环境贴图, 可以看到窗子反射的光
    // box.envMap = envMap;
  })


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

};
