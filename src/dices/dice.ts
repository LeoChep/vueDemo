import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import "@babylonjs/loaders";
import type { AbstractMesh } from "@babylonjs/core/Legacy/legacy";
import { bonesVertex } from "@babylonjs/core/Shaders/ShadersInclude/bonesVertex";
import {
  InstancedMesh,
  Material,
  Mesh,
  PhysicsImpostor,
  Scene,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/procedural-textures";
import axios from "axios";

// Dices
//load mesh
const loadDiceMesh = async (scene: Scene) => {
  let dicesGlbMap;
  await axios.get("asset/dices/diceGlb.json").then((response) => {
    console.log(response.data);
    dicesGlbMap = response.data;
  });
  const materialWood = new BABYLON.StandardMaterial("wood", scene);
  materialWood.diffuseTexture = new BABYLON.Texture(
    "asset/dices/" + dicesGlbMap["texture"],
    scene,
    false,
    false
  );
  Object.keys(dicesGlbMap["dices"]).forEach(async (k) => {
    //
    materialWood.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    await BABYLON.SceneLoader.ImportMeshAsync(
      "",
      "asset/dices/" + dicesGlbMap["dices"][k],
      "",
      scene
    ); //默认加载到最后一个创建的scene
    const box = scene.getMeshByName(k) as Mesh;
    // console.log(box);
    // box.parent = null;
    box.isVisible = false;
    //box = BABYLON.MeshBuilder.CreateBox("Box", { size: 3 }, scene);
    box.position = new BABYLON.Vector3(0, 2, 0);

    box.material = materialWood;
  });
};
// const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
// shadowGenerator.addShadowCaster(box);
const createDice = async (scene: Scene, name: string) => {
  const box = scene.getMeshByName(name) as Mesh;
  const instance = box.createInstance(name);

  for (const child of box.getChildTransformNodes()) {
    const locator = child.clone(child.name, instance);
    if (!locator) {
      throw new Error("Unable to clone dice locator");
    }
    const vec3 = child.getAbsolutePosition();
    locator.setAbsolutePosition(vec3);
    locator.name = child.name;
    instance.addChild(locator as AbstractMesh);
  }
  // instance.translate(new Vector3(0, 1, 0), 2);
  instance.physicsImpostor = new PhysicsImpostor(
    instance,
    PhysicsImpostor.ConvexHullImpostor,
    { mass: 8, friction: 0.3, restitution: 0.7 },
    scene
  );

  if (instance.metadata === null) instance.metadata = {};
  instance.metadata.type = "dice";
  //window.console.log(scene);
  return instance;
};
const rollDiceIns = async (instance: InstancedMesh) => {
  console.log(instance);
  instance.position.y = 2;
  instance.metadata.rollNum = 0;
  instance.addRotation(
    360 * Math.random() - 180,
    360 * Math.random() - 180,
    360 * Math.random() - 180
  );
  instance
    .getPhysicsImpostor()
    ?.applyImpulse(
      new Vector3(Math.random() * 30 - 15, 30, Math.random() * 30 - 15),
      new Vector3(1 * Math.random() - 1, 0, 1 * Math.random() - 1)
    );

  const loop = (
    scene: Scene,
    ins: InstancedMesh,
    stopCount: number,
    resolve
  ) => {
    BABYLON.setAndStartTimer({
      timeout: 300,
      contextObservable: scene.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return scene.isDisposed;
      },
      onEnded: async (data) => {
        let stopFlag = true;
        const velocity = ins?.physicsImpostor?.getAngularVelocity() as Vector3;
        velocity.x = Math.abs(velocity.x % Math.PI);
        velocity.y = Math.abs(velocity.y % Math.PI);
        velocity.z = Math.abs(velocity.z % Math.PI);
        const lineVelocity = ins
          ?.getPhysicsImpostor()
          ?.getLinearVelocity() as Vector3;
        lineVelocity.x = Math.abs(lineVelocity.x);
        lineVelocity.y = Math.abs(lineVelocity.y);
        lineVelocity.z = Math.abs(lineVelocity.z);
        if (velocity.x > 0.01 || velocity.y > 0.01 || velocity.z > 0.01)
          stopFlag = false;
        if (
          lineVelocity.x > 0.01 ||
          lineVelocity.y > 0.01 ||
          lineVelocity.z > 0.01
        )
          stopFlag = false;
        if (!stopFlag) {
          stopCount = 0;
        } else {
          stopCount++;
        }
        const items = ins.getChildren() as AbstractMesh[];
        let higher = items[0] as AbstractMesh;
        for (const item of items) {
          if (item.getAbsolutePosition().y > higher.getAbsolutePosition().y) {
            higher = item;
          }
        }
        rollnum = translateValue(higher.name);
        if (ins.metadata["rollNum"] !== rollnum) {
          ins.metadata["rollNum"] = rollnum;
        }

        if (stopCount <= 2) {
          loop(scene, ins, stopCount, resolve);
        } else {
          const items = ins.getChildren() as AbstractMesh[];
          let higher = items[0] as AbstractMesh;
          for (const item of items) {
            if (item.getAbsolutePosition().y > higher.getAbsolutePosition().y) {
              higher = item;
            }
          }
          resolve(higher.name);
        }
        // this will run when the timeout has passed
      },
    });
  };
  const awaitRoll = new Promise<string>((resolve) => {
    loop(instance.getScene(), instance, 0, resolve);
  });
  let rollnum: number | null = null;
  await awaitRoll.then((result) => {
    rollnum = translateValue(result);
  });
  return rollnum as number | null;
};
const translateValue = (str: string) => {
  let rollnum: number | null = null;
  const patt1 = /[_]\d+/g;
  const matchStr = str.match(patt1);
  if (matchStr !== null) rollnum = parseInt(matchStr[0].replace("_", ""));
  return rollnum;
};
export { loadDiceMesh, createDice, rollDiceIns };
