import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 补间动画
 */
// 补间动画的库
import {Tween, Easing} from 'three/examples/jsm/libs/tween.module'
// GLTF加载器 加载gltf文件
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
// hdr加载器 专门用来加载hdr
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {reflectVector} from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
import {MeshBasicMaterial} from "three";
import {MouseEvent} from "react";
export const init14 = () => {
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
  /** 球 */
  const qiu = new THREE.Mesh(new THREE.SphereGeometry(1,32,32), new THREE.MeshBasicMaterial({color: 'pink'}))

  scene.add(camara, qiu, axesHelper); // 将相机添和物体加到场景中
  const tween = new Tween(qiu.position);
  tween.to({x: 4}, 1000).onUpdate((x,y)=> {
    // console.log(x, y)
  });
  // tween.repeat(Infinity); // 循环无数次
  // tween.yoyo(true); // 循环往复执行
  // tween.delay(1000); // 延迟3s后再运行
  tween.easing(Easing.Quintic.InOut); // 设置缓动函数
  // tween.start(); // 启动


  const tween2 = new Tween(qiu.position);
  tween2.to({x: -4}, 2000)
  tween.chain(tween2);
  tween2.chain(tween); // 动画返回
  tween.start(); // 连接动画的话，启动一次即可


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
    tween.update(); // 每一帧都需要更新
  };
  renderFun(0);

};
