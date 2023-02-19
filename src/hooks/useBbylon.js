import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

import myTexture from '../assets/ground.jpg'
import earthTexture from '../assets/earth.jpg'

// 在全局作用域中导入 Cannon.js 库
window.CANNON = require('cannon');

export const useBabylon = () => {
  const createScene = (canvas) => {
    const engine = new BABYLON.Engine(canvas, true, { useWebGPU: true });

    /** 创建场景 */
    const scene = new BABYLON.Scene(engine);
    /** 加载物理引擎 */
    const physicsPlugin = new BABYLON.CannonJSPlugin();

    scene.enablePhysics(new BABYLON.Vector3(0,-9.81,0), physicsPlugin);

    /**
     * 创建摄像头
     * 
     * babylonJs摄像头共分为4种:
     * 
     * ArcRotateCamera：一种经典的模拟摄像机类型，它以一个场景的中心为旋转中心，并以圆弧的方式旋转摄像机。
     *    alpha：摄像机的水平角度。
     *    beta：摄像机的垂直角度。
     *    radius：摄像机与旋转中心之间的距离。
     *    target：旋转中心的目标位置。
     * 
     * FreeCamera：一种灵活的摄像机类型，它没有任何限制，可以在场景中任意移动。
     *    position：摄像机的位置。
     *    upVector：摄像机向上的方向。
     * 
     * FollowCamera：一种跟随摄像机类型，它可以跟随一个指定的目标对象移动。
     *    lockedTarget：要跟随的目标对象。
     *    radius：摄像机与目标之间的距离.
     *    heightOffset：摄像机的高度偏移量。
     *    cameraAcceleration：摄像机的加速度。
     * 
     * UniversalCamera：一种可以通过键盘和鼠标控制的摄像机类型，与FreeCamera类似，但提供了额外的键盘和鼠标控制。
     *    position：摄像机的位置。 
     *    upVector：摄像机向上的方向。
     *    speed：摄像机的移动速度。
     *    checkCollisions：摄像机是否与场景中的其他对象发生碰撞。
     */
    const camera =  new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
    // 设置摄像机位置和目标
    camera.radius = 20;
    camera.heightOffset = 10;
    camera.rotationOffset = 0;
    camera.cameraAcceleration = 0.005;
    camera.maxCameraSpeed = 10;
    camera.angularSensibility = 1000; // 设置相机的旋转灵敏度

    /**
     * 创建材质
     * 
     * CreateBox：创建一个立方体。
     * 
     * CreateSphere：创建一个球体。
     * 
     * CreateCylinder：创建一个圆柱体。
     * 
     * CreateCone：创建一个圆锥体。
     * 
     * CreateTorus：创建一个圆环体。
     * 
     * CreateGround：创建一个平面。
     * 
     * CreatePlane：创建一个平面。
     * 
     * CreateDisc：创建一个圆盘。
     * 
     * CreateIcoSphere：创建一个 IcoSphere。
     */
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    const ballPhysicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.5, restitution: 0.9 }, scene)

    sphere.physicsImpostor = ballPhysicsImpostor
    
    const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);

    sphereMaterial.diffuseTexture = new BABYLON.Texture(earthTexture, scene);

    sphere.material = sphereMaterial

    sphere.position.y = 1

    camera.lockedTarget = sphere

    scene.activeCamera = camera

    /**
     * 创建光源
     * 
     * PointLight：点光源，发出光线的方向是固定的。
     * 
     * DirectionalLight：方向光，光线的方向是固定的，与PointLight的区别是，它并不从特定的位置发出光线。
     * 
     * SpotLight：聚光灯，从特定的位置发出光线，光线有一个固定的方向，并在一定角度内形成一个扇形。
     * 
     * HemisphericLight：半球光，从固定的方向发出光线，围绕场景中心发散。
     * 
     *    name：灯光的名称。
     * 
     *    position：灯光的位置。 
     * 
     *    direction：灯光的方向。
     * 
     *    intensity：灯光的亮度。
     * 
     *    diffuse：灯光的散射颜色。
     * 
     *    specular：灯光的镜面反射颜色。
     * 
     *    angle：聚光灯的扇形角度。
     * 
     *    exponent：聚光灯的衰减系数。
     * 
     *    groundColor：半球光的地面颜色。
     * 
     *    includeOnlyWithLayerMask：该灯光是否仅在特定的图层上生效。
     */
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    /** 地面相关 */
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

    /** 将地面设置为静态物体， 否则地面会不停下坠 */
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.7 }, scene);

    // 加载图片
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

    groundMaterial.diffuseTexture = new BABYLON.Texture(myTexture, scene);

    ground.material = groundMaterial

    ground.position.y = -0.5 

    // // 将摄像机作为场景的活动摄像机
    // scene.activeCamera = camera;

    // 获取按键事件
    var inputMap = {};
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
  
    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
      inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    
  // 更新小球状态
  scene.onBeforeRenderObservable.add(function() {
    var speed = 0.1;
    var friction = 0.05;

    // 根据按键状态移动小球
    if (inputMap["w"]) {
      sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, -speed), sphere.getAbsolutePosition());
    }
    if (inputMap["s"]) {
      sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 0, speed), sphere.getAbsolutePosition());
    }
    if (inputMap["a"]) {
      sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(-speed, 0, 0), sphere.getAbsolutePosition());
    }
    if (inputMap["d"]) {
      sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(speed, 0, 0), sphere.getAbsolutePosition());
    }

    // 计算摩擦力
    var velocity = sphere.physicsImpostor.getLinearVelocity();
    if (velocity.length() > 0.01) {
      var frictionForce = velocity.normalize().scale(-friction * 1);
      debugger
      sphere.physicsImpostor.applyForce(frictionForce, sphere.getAbsolutePosition());
    }
  });

    // 渲染场景
    engine.runRenderLoop(function () {
      scene.render();
    });

    // 监听窗口大小变化
    window.addEventListener("resize", function () {
      engine.resize();
    });

    return scene
  }

  return {
    createScene
  }

}