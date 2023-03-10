import { InstancedMesh, Mesh, Vector3, type Scene } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import {
  createDice,
  loadDiceMesh,
  rollDiceIns,
} from "@/diceTrayPluginMoudle/ammoDiceMoudle";
import {
  createScene as createDiceTable,
  cleanDiceTable,
} from "@/diceTrayPluginMoudle/diceTableMoudle";
import type { Dice, DicesPlugin } from "@/dices/rollerMoudle";
import { subscribe } from "@/tools/SubscribeMan";
class DiceTrayDice implements Dice {
  diceType = "";
  getResultValue = async () => {
    return await this.resultValue;
  };
  mesh!: InstancedMesh;
  value!: number;
  proxy: any;
  getValue() {
    return this.value;
  }
  resultValue!: Promise<number>;
}
class DiceTrayPlugin implements DicesPlugin {
  scene!: Scene;

  constructor() {}
  cleanDices() {
    cleanDiceTable(this.scene);
  }
  async createDiceTray(canvas: HTMLCanvasElement) {
    //创建引擎
    const engine = new BABYLON.Engine(canvas as HTMLCanvasElement, true, {
      deterministicLockstep: true,
      lockstepMaxSteps: 4,
    });
    //生成Scene
    const scene = await createDiceTable(engine);
    this.scene = scene;
    const camera = new BABYLON.TargetCamera("camera", new Vector3(0, 20, 0));
    camera.setTarget(new Vector3(0, 0, 0));
    camera.attachControl(engine.getRenderingCanvas(), true);
    const light = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(0, 20, 40),
      scene
    );
    await loadDiceMesh(scene);
    engine.runRenderLoop(async function () {
      scene.render();
    });

    // 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
    window.addEventListener("resize", function () {
      engine.resize();
    });
  }
  roll = async (diceType: string) => {
    const diceMesh = await createDice(this.scene, diceType);
    const resultValue = rollDiceIns(diceMesh);
    const dice = new DiceTrayDice();
    dice.diceType = diceType;
    dice.mesh = diceMesh;
    dice.value = 0;
    dice.proxy = dice;
    diceMesh.metadata = subscribe(diceMesh.metadata, "rollNum", () => {
      console.log("change");
      dice.proxy.value = diceMesh.metadata.rollNum;
    });
    dice.resultValue = resultValue as Promise<number>;
    dice.resultValue.then((result) => {
      dice.proxy.value = result;
    });

    return dice;
  };
}

export { DiceTrayPlugin };
