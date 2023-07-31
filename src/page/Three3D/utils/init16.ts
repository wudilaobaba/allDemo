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
export const init16 = () => {
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
  // 创建自定义几何体 - 使用索引创建一个正方形面
  const geometry = new THREE.BufferGeometry();
  // 顶点是有顺序的，逆时针为正面
  const v = [
    // 三个点依次是一个逆时针排列的，所以默认是正面
    -1.0, -1.0, 0.0, // 左下
    1.0, -1.0, 0.0, // 右下
    1.0,1.0, 0.0, // 右上
    -1.0,1.0, 0.0, // 左上
  ]
  // uv坐标 要与上面的平面坐标对应上
  const uvX = new Float32Array([
    0,0,
    1,0,
    1,1,
    0,1
  ]);
  const v1Float32Array = new Float32Array(v); // 一个面
  // 设置几何体顶点位置，一个顶点需要三条数据（x,y,z）
  geometry.setAttribute('position', new THREE.BufferAttribute(v1Float32Array,3));
  // 利用索引重复使用上面的点
  const indices = new Uint16Array([0,1,2,2,3,0 ]);
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  // 设置两个顶点组，形成两个材质 按照索引来分配材质
  geometry.addGroup(0,3, 0);
  geometry.addGroup(3,3, 1);
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvX, 2))

  /** 给自定义的平面添加法线向量 */
  geometry.computeVertexNormals();
  geometry.rotateX(-Math.PI/2)
  // 设置2个几何体材质
  const material1 = new THREE.MeshBasicMaterial({
    color: '#098765',
    side: THREE.DoubleSide, // 设置两面都能看到
    wireframe: false
  })

  // 创建UV贴图
  const uv = new THREE.TextureLoader().load('./texture/uv_grid_opengl.jpg')
  const material2 = new THREE.MeshBasicMaterial({
    map: uv
  })
  const cube = new THREE.Mesh(geometry, [material2]);


  const plant = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({
    map: uv
  }))
  plant.position.x = 3;
  scene.add(camara, cube,plant, axesHelper); // 将相机添和物体加到场景中


  /** 环境贴图 - 可以让鸭子亮起来 */
  new RGBELoader().load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr',(envMap)=>{
    // 设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.background = envMap;
    scene.environment = envMap;
    // 设置平面材质的环境贴图, 可以看到窗子反射的光
    plant.material.envMap = envMap;
    material2.envMap = envMap;
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
