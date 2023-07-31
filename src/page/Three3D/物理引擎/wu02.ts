import * as THREE from "three";
import * as CANNON from 'cannon-es'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
export const wu02 = () => {
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
        // alpha: true
    });
    /** 渲染器大小设置 */
    render.setSize(window.innerWidth, window.innerHeight);
    const threeCanvas = render.domElement;
    threeCanvas.style.position = 'fixed'
    threeCanvas.style.top = '0'
    threeCanvas.style.left = '0'
    document.body.insertBefore(threeCanvas, document.getElementById("root"));
    const controller = new OrbitControls(camara, threeCanvas);
    controller.enableDamping = true; // 阻尼，有惯性，看起来更加真实
    controller.dampingFactor = 0.01; // 设置阻尼系数，越小惯性越大
    controller.autoRotate = false; // 轨道自动旋转
    /** 创建辅助坐标系 */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(camara, axesHelper)
    /** 创建物理世界 */
    const world = new CANNON.World();
    const cubeWorldMaterial = new CANNON.Material('default');
    const cubes = []
    const createCube = ()=>{
        const cubeGeometry = new THREE.BoxGeometry(1,1,1);
        const cubeMaterial = new THREE.MeshStandardMaterial();
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        // 物理世界小方块
        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5 ));
        const cubeBody = new CANNON.Body({
            shape: cubeShape,
            position: new CANNON.Vec3(0,0,0),
            mass: 1, // 方块质量
            material: cubeWorldMaterial
        });
        // 立方体施加力
        cubeBody.applyLocalForce(
            new CANNON.Vec3(1900,0,0), // 应用力大小方向
            new CANNON.Vec3(0,0,0)// 在哪个点施加力量
        )
        world.addBody(cubeBody);
        scene.add(cube)
        // 监听碰撞事件
        const fit = (e: any)=>{
            // 碰撞强度
            const impactStrength: number = e.contact.getImpactVelocityAlongNormal()
            console.log(impactStrength)
        }
        cubeBody.addEventListener('collide',fit)
        cubes.push({
            mesh: cube,
            body: cubeBody
        })
    }
    const planeGeometry = new THREE.PlaneGeometry(10,10);
    const planeMaterial = new THREE.MeshStandardMaterial();
    const floor = new THREE.Mesh(planeGeometry, planeMaterial);
    floor.rotation.x = -Math.PI/2
    floor.position.y = -4
    scene.add(floor)
    const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff,0.5);
    render.shadowMap.enabled = true
    dirLight.castShadow = true
    floor.receiveShadow = true;

    scene.add(ambientLight, dirLight)
    const gltfLoader = new GLTFLoader();

    world.gravity.set(0,-9.8,0);// 设置重力


    // 物理世界地面
    const planeShape = new CANNON.Plane();
    const planeWorldMaterial = new CANNON.Material('floor');
    const planeBody = new CANNON.Body({
        shape: planeShape,
        position: new CANNON.Vec3(0,-4,0),
        mass:0, // 小球质量
        material: planeWorldMaterial
    });
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
    // 两种材质的关联
    const defaultContactMaterial = new CANNON.ContactMaterial(cubeWorldMaterial, planeWorldMaterial,{
        friction: 0.1, // 摩擦系数
        restitution: 0.7 //弹性
    })
    world.addBody(planeBody);
    world.addContactMaterial(defaultContactMaterial)

    // 监听窗口变化
    window.addEventListener('resize', () => {
        // 重置渲染器高度比
        render.setSize(window.innerWidth, window.innerHeight);
        // 重置相机宽高比
        camara.aspect = window.innerWidth / window.innerHeight;
        // 更新相机投影矩阵
        camara.updateProjectionMatrix();
    });
    window.addEventListener('click',createCube)
    const clock = new THREE.Clock();
    const renderFun: FrameRequestCallback = () => {
        controller.update();
        render.render(scene, camara);
        requestAnimationFrame(renderFun);
        const deltaTime = clock.getDelta(); // 两帧之间的时间差
        world.step(1/120, deltaTime);
        cubes.forEach(item=>{
            item.mesh.position.copy(item.body.position);
            item.mesh.quaternion.copy(item.body.quaternion) // 保持物理一致
        })
        // @ts-ignore
        // cube.position.copy(cubeBody.position)
        // @ts-ignore
        // floor.position.copy(planeBody.position)
    };
    renderFun(0);
};
