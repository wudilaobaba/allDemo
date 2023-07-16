import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/***
 * Three自带的GUI调试工具的使用
 */
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
export const init07 = () => {
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
  // 创建自定义几何体
  const geometry = new THREE.BufferGeometry();
  // 顶点是有顺序的，逆时针为正面
  const v1 = [
    // 三个点依次是一个逆时针排列的，所以默认是正面
    -1.0, -1.0, 0.0, // 左下
    1.0, -1.0, 0.0, // 右下
    1.0,1.0, 0.0, // 右上
  ]
  const v2 = [
    // 三个点依次是一个逆时针排列的，所以默认是正面
    1.0,1.0, 0.0, // 右上
    -1.0, 1.0, 0.0, // 左上
    -1.0, -1.0, 0.0, // 左下
  ]
  const v1Float32Array = new Float32Array(v1); // 一个面
  const v2Float32Array = new Float32Array(v2); // 一个面
  const v3Float32Array = new Float32Array([...v1, ...v2]); // 组合面
  // 设置几何体顶点位置，一个顶点需要三条数据（x,y,z）
  geometry.setAttribute('position', new THREE.BufferAttribute(v3Float32Array,3));
  // 设置几何体材质
  const material = new THREE.MeshBasicMaterial({
    color: '#098765',
    side: THREE.DoubleSide, // 设置两面都能看到
    wireframe: false
  })
  const cube = new THREE.Mesh(geometry, material);

  scene.add(camara,cube, axesHelper); // 将相机添和物体加到场景中
  render.render(scene, camara);
  // 监听窗口变化
  window.addEventListener('resize',()=>{
    // 重置渲染器高度比
    render.setSize(window.innerWidth, window.innerHeight);
    // 重置相机宽高比
    camara.aspect = window.innerWidth/window.innerHeight;
    // 更新相机投影矩阵
    camara.updateProjectionMatrix();
  })

  const renderFun: FrameRequestCallback = () => {
    controller.update();
    render.render(scene, camara);
    requestAnimationFrame(renderFun);
  };
  renderFun(0);
};
