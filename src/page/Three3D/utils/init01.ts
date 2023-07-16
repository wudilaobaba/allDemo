import * as THREE from "three";
// 【轨道控制器】
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/***
 * 使用【轨道控制器】查看3D物体
 */
export const init01 = () => {
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

  /** 物体大小 */
  const cubeOuter = new THREE.BoxGeometry(1, 1, 1);
  /** 物体材质 */
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  /** 创建物体 */
  const cube = new THREE.Mesh(cubeOuter, cubeMaterial);
  scene.add(camara, cube); // 将相机添和物体加到场景中
  /** 初始化渲染器 */
  const render = new THREE.WebGLRenderer();
  /** 渲染器大小设置 */
  render.setSize(window.innerWidth, window.innerHeight);
  const threeCanvas = render.domElement;
  document.body.insertBefore(threeCanvas, document.getElementById("root"));

  /** 创建轨道控制器 - 相机围绕着目标进行运动 */
  new OrbitControls(camara, threeCanvas);
  // 注意：浏览器每60ms都会自动渲染一次, 并执行requestAnimationFrame函数及其回调函数
  const renderFun = () => {
    /** 渲染到页面 */
    render.render(scene, camara);
    requestAnimationFrame(renderFun);
  };
  renderFun();
};
