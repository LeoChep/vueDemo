<template>
  <div id="diceTray">
    result: {{ result }}
    <div class="dice_button">
      {{ diceNum["d4"] }}
      <button @click="addDice('d4')">d4</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d6"] }}
      <button @click="addDice('d6')">d6</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d8"] }}
      <button @click="addDice('d8')">d8</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d10"] }}
      <button @click="addDice('d10')">d10</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d12"] }}
      <button @click="addDice('d12')">d12</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d20"] }}
      <button @click="addDice('d20')">d20</button>
    </div>
    <div class="dice_button">
      {{ diceNum["d100"] }}
      <button @click="addDice('d100')">d100</button>
    </div>
    <button @click="rollDices()">roll</button>
    <button @click="cleanDicesClick()">clean</button>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    //touch-action="none" for best results from PEP
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
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
import { DiceTrayPlugin } from "@/DiceTrayPlugin/DiceTrayPlugin";
import "@babylonjs/procedural-textures";
import {
  createScene as createDiceTable,
  cleanDiceTable,
} from "@/dices/diceTable";
import { createDice, loadDiceMesh, rollDiceIns } from "@/dices/dice";
import { Roller } from "@/dices/roller";
import { computed } from "vue";

const result = ref(0);

let rollDices = async () => {
  console.log("未加载方法");
};
let cleanDicesClick = async () => {
  console.log("未加载方法");
};
const diceNum = ref({} as any);

const addDice = (type: string) => {
  if (diceNum.value[type] === undefined) diceNum.value[type] = ref(0);
  console.log(diceNum[type]);
  diceNum.value[type]++;
};
// 获取当前组件实例
onMounted(async () => {
  //初始化骰桌
  var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // 得到canvas对象的引用
  //使用DiceTray插件
  const diceTrayPlugin = new DiceTrayPlugin();
  await diceTrayPlugin.createDiceTray(canvas);
  const roller = new Roller(diceTrayPlugin);

  const roolDice = async (type: string) => {
    const dice = await roller.roll(type);
    result.value = await dice.resultValue;
    return dice;
  };
  rollDices = async () => {
    Object.keys(diceNum.value).forEach(async (type) => {
      const dices = await roller.rollndx(diceNum.value[type], type);
      for (let dice of dices) {
        dice.resultValue.then((resultValue) => {
          result.value = result.value + resultValue;
        });
      }
    });
  };
  cleanDicesClick = async () => {
    diceTrayPlugin.cleanDices();
    result.value = 0;
    Object.keys(diceNum.value).forEach(async (type) => {
      diceNum.value[type] = 0;
    });
  };
});
</script>
<style>
html,
html,
html,
html,
body {
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.dice_button {
  display: inline-block;
}

.dice_button p {
  display: block;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
