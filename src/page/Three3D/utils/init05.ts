import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/***
 * 使用Clock控制物体变化
 */
export const init05 = () => {
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

  /** 物体大小 */
  const cubeOuter = new THREE.BoxGeometry(1, 1, 1);
  /** 物体材质 */
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  /** 创建物体 */
  const cube = new THREE.Mesh(cubeOuter, cubeMaterial);
  const parentCube = new THREE.Mesh(cubeOuter, cubeMaterial);
  parentCube.add(cube);
  /** 初始化渲染器 */
  const render = new THREE.WebGLRenderer();
  /** 渲染器大小设置 */
  render.setSize(window.innerWidth, window.innerHeight);
  const threeCanvas = render.domElement;
  threeCanvas.onclick = ()=>{
    // 这是让元素全屏显示的方法
    threeCanvas.requestFullscreen();
    // 退出全屏
    // document.exitFullscreen();
  }
  document.body.insertBefore(threeCanvas, document.getElementById("root"));

  /** 设置物体的位置 */
  // cube.position.set(1, 1, 0);
  // cube.position.x = 2;

  /** 创建轨道控制器 - 相机围绕着目标进行运动 */
  const controller = new OrbitControls(camara, threeCanvas);
  controller.enableDamping = true; // 阻尼，有惯性，看起来更加真实
  controller.dampingFactor = 0.01; // 设置阻尼系数，越小惯性越大
  // controller.autoRotate = true; // 轨道自动旋转
  /** 创建辅助坐标系 */
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(camara, parentCube, axesHelper); // 将相机添和物体加到场景中

  const clock = new THREE.Clock();
  parentCube.position.x = 1;
  cube.scale.set(2, 2, 2); // 子元素放大了
  parentCube.rotation.x = Math.PI / 4; // 此时父子同时旋转
  cube.rotation.x = Math.PI / 4; // 45度 然后子元素又旋转的45度
  // 注意：浏览器每60ms都会自动渲染一次, 并执行requestAnimationFrame函数及其回调函数
  const renderFun: FrameRequestCallback = () => {
    controller.update();
    // 获取时钟运行的总时长：
    let time = clock.getElapsedTime();
    // console.log(time);
    // let delayTTime = clock.getDelta();
    // console.log("时钟运行的总时长:", time);
    // console.log("两次运行间隔:", delayTTime);
    let t = time % 5; // 根据运行的总时间做点文章！！！！！！！！！！
    cube.position.x = t;
    render.render(scene, camara);
    requestAnimationFrame(renderFun);
  };
  renderFun(0);
  // 监听窗口变化
  window.addEventListener('resize',()=>{
    // 重置渲染器高度比
    render.setSize(window.innerWidth, window.innerHeight);
    // 重置相机宽高比
    camara.aspect = window.innerWidth/window.innerHeight;
    // 更新相机投影矩阵
    camara.updateProjectionMatrix();
  })
};
