import * as THREE from "three";
// 【轨道控制器】 子元素实际上是以父元素为参照的
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// draco解析器
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
/***
 * 包围盒
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
export const init17 = () => {
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
  const gltfLoader= new GLTFLoader();
  gltfLoader.load('./model/Duck.glb', (gltf)=>{
    console.log(gltf)
    console.log(gltf.scene.children[0].children[0].name)// .sence
    scene.add(gltf.scene)
    const duckMesh = gltf.scene.getObjectByName(gltf.scene.children[0].children[0].name);
    const duckGeometry = (duckMesh as any).geometry;
    // 计算包围盒
    duckGeometry.computeBoundingBox();
    // 设置几何体居中
    duckGeometry.center();
    // 获取duck包围盒
    const duckBox = duckGeometry.boundingBox;

    // 更新世界矩阵
    duckMesh.updateWorldMatrix(true, true);
    // 更新包围盒
    duckBox.applyMatrix4(duckMesh.matrixWorld);
    // 获取包围盒中心点
    const center = duckBox.getCenter(new THREE.Vector3());
    console.log({center});
    // 创建包围盒辅助器
    const boxHelper = new THREE.Box3Helper(duckBox);
    // 添加包围盒辅助器
    scene.add(boxHelper);
    console.log(duckBox);
    console.log(duckMesh);



    // 获取包围球
    const duckSphere = duckGeometry.boundingSphere;
    duckSphere.applyMatrix4(duckMesh.matrixWorld);

    console.log(duckSphere);
    // 创建包围球辅助器
    const sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.copy(duckSphere.center);
    scene.add(sphereMesh);

  })
  scene.add(camara, axesHelper); // 将相机添和物体加到场景中


  /** 环境贴图 - 可以让鸭子亮起来 */
  new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',(envMap)=>{
    // 设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    // scene.background = envMap;
    scene.environment = envMap;
    // 设置平面材质的环境贴图, 可以看到窗子反射的光
    // plant.material.envMap = envMap;
    // material2.envMap = envMap;
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
