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
import { DiceTrayPlugin } from "@/diceTrayPluginMoudle/DiceTrayPlugin";
import "@babylonjs/procedural-textures";
import { subscribe } from "@/tools/SubscribeMan";
import { Roller } from "@/dices/rollerMoudle";
import "@/dices/DiceFormulaTrans";
import {
  DiceFormula,
  Formula,
  parseDiceFormula,
} from "@/dices/DiceFormulaTrans";
const result = ref(0);
const resultDetail = ref("");
const dicesFormula = ref("");
let rollCommand = async () => {
  console.log("???????????????");
};
let rollDices = async () => {
  console.log("???????????????");
};
let cleanDicesClick = async () => {
  console.log("???????????????");
};
const diceNum = ref({} as any);

const addDice = (type: string) => {
  if (diceNum.value[type] === undefined) diceNum.value[type] = ref(0);
  console.log(diceNum[type]);
  diceNum.value[type]++;
};
// ????????????????????????
onMounted(async () => {
  //???????????????
  var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // ??????canvas???????????????
  //??????DiceTray??????
  const diceTrayPlugin = new DiceTrayPlugin();
  await diceTrayPlugin.createDiceTray(canvas);

  // const roolDice = async (type: string) => {
  //   const dice = await roller.roll(type);
  //   result.value = await dice.resultValue;
  //   return dice;
  // };
  let roller = new Roller(diceTrayPlugin);
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
    roller = new Roller(diceTrayPlugin);
  };
  rollCommand = async () => {
    diceTrayPlugin.cleanDices();
    const formulaNode = new Formula();
    const formulas = parseDiceFormula(dicesFormula.value);
    formulaNode.children = formulas;
    const rollDice = (formula: Formula) => {
      for (const formulaItem of formula.children) {
        if (formulaItem.type === "formula") rollDice(formulaItem);
        if (formulaItem.type === "diceFormula") {
          const diceFormulaItem = formulaItem as DiceFormula;
          diceFormulaItem.diceRoller = new Roller(diceTrayPlugin);
          const diceRoller = diceFormulaItem.diceRoller as Roller;
          diceRoller.rollXdY(formulaItem.text);
        }
      }
    };
    rollDice(formulaNode);
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
