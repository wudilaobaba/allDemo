import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 射线的使用
 */
// GLTF加载器 加载gltf文件
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
// hdr加载器 专门用来加载hdr
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {reflectVector} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
import {MeshBasicMaterial} from "three";
import {MouseEvent} from "react";
export const init13 = () => {
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
  /** 创建三个圆球 */
  const qiu1 = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), new MeshBasicMaterial({color:"pink"}))
  qiu1.position.x = -4
  const qiu2 = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), new MeshBasicMaterial({color:"blue"}))
  const qiu3 = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), new MeshBasicMaterial({color:"yellow"}))
  qiu3.position.x = 4
  scene.add(camara, qiu1,qiu2,qiu3, axesHelper); // 将相机添和物体加到场景中


  /** 创建射线 */
  const raycaster = new THREE.Raycaster();
  // 将鼠标坐标转为实际坐标
  const mouse = new THREE.Vector2();
  window.addEventListener('click', (e: globalThis.MouseEvent)=>{
    mouse.x = (e.clientX/window.innerWidth) * 2 -1;
    mouse.y = -((e.clientY/window.innerHeight) * 2 -1);
    /** 通过摄像机和鼠标的位置更新射线 */
    raycaster.setFromCamera(mouse, camara);
    // 检测射线是否碰到了物体
    const intersects = raycaster.intersectObjects([qiu3, qiu2, qiu1]);
    if(intersects.length){
      intersects[0].object.position.x+=3
    }
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
