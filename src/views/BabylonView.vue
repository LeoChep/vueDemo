<template>
  <div id="diceTray">
    result: {{ resultDetail }}
    <div class="buttons">
      <div class="dice_button">
        <p v-if="diceNum['d4'] > 0">{{ diceNum["d4"] }}</p>
        <button @click="addDice('d4')">d4</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d6'] > 0">{{ diceNum["d6"] }}</p>
        <button @click="addDice('d6')">d6</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d8'] > 0">{{ diceNum["d8"] }}</p>
        <button @click="addDice('d8')">d8</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d10'] > 0">{{ diceNum["d10"] }}</p>
        <button @click="addDice('d10')">d10</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d12'] > 0">{{ diceNum["d12"] }}</p>
        <button @click="addDice('d12')">d12</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d20'] > 0">{{ diceNum["d20"] }}</p>
        <button @click="addDice('d20')">d20</button>
      </div>
      <div class="dice_button">
        <p v-if="diceNum['d100'] > 0">{{ diceNum["d100"] }}</p>
        <button @click="addDice('d100')">d100</button>
      </div>
      <button @click="rollDices()">roll</button>
      <button @click="cleanDicesClick()">clean</button>
    </div>
    <input v-model="dicesFormula" placeholder="edit me" />
    <div class="dice_button">
      <button @click="rollCommand()">roll</button>
    </div>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    //touch-action="none" for best results from PEP
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import "@babylonjs/loaders";
import { DiceTrayPlugin } from "@plugin/dice_modules/diceTrayPluginMoudle/DiceTrayPlugin";
import { MathDicePlugin } from "@plugin/dice_modules/mathDicePluginMoudle/MathDice";
import "@babylonjs/procedural-textures";
import { subscribe } from "@plugin/tool_modules/SubscribeMan/SubscribeMan";
import { Roller } from "@plugin/dice_modules/dices/rollerMoudle";
import {
  DiceFormula,
  Formula,
  parseDiceFormula,
} from "@plugin/dice_modules/dices/DiceFormulaTrans";
import { DiceCommander } from "@plugin/dice_modules/dices/commandMoudle/DiceCommander";
const result = ref(0);
const resultDetail = ref("");
const dicesFormula = ref("");
let rollCommand = async () => {
  console.log("未加载方法");
};
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
  //使用MathDices插件
  // const diceTrayPlugin = new MathDicePlugin();
  // const roolDice = async (type: string) => {
  //   const dice = await roller.roll(type);
  //   result.value = await dice.resultValue;
  //   return dice;
  // };
  Roller.dicesplugin = new MathDicePlugin();
  let roller = new Roller();
  rollDices = async () => {
    roller.proxy = roller;
    let singleNum = 0;
    Object.keys(diceNum.value).forEach(async (type) => {
      roller.rollndx(diceNum.value[type], type);
    });
    roller = subscribe(roller, "value", async () => {
      const proxy = roller.proxy as Roller;
      result.value = result.value - singleNum;
      singleNum = proxy.value;
      result.value = result.value + singleNum;
      resultDetail.value = proxy.toString();
    });
    Object.keys(diceNum.value).forEach(async (type) => {
      diceNum.value[type] = 0;
    });
  };
  cleanDicesClick = async () => {
    diceTrayPlugin.cleanDices();
    result.value = 0;
    Object.keys(diceNum.value).forEach(async (type) => {
      diceNum.value[type] = 0;
    });
    resultDetail.value = "";
    roller = new Roller();
  };
  const diceCommander = new DiceCommander();
  rollCommand = async () => {
    const command = diceCommander.excute(dicesFormula.value);
    subscribe(command, "value", () => {
      resultDetail.value = command.value;
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
  text-align: center;
}

#renderCanvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>
