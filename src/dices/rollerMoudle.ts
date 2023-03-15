import { subscribe } from "@/tools/SubscribeMan";

interface DicesPlugin {
  roll: (diceType: string) => Promise<Dice>;
  cleanDices();
}
interface Dice {
  //异步类
  diceType: string;
  resultValue: Promise<number>; //结果数值
  value: number; //当前数值
  getValue: () => number;
  getResultValue: () => Promise<number>;
}
export default {};
class Roller {
  proxy: any;
  dices = [] as (Promise<Dice> | Dice)[];
  value = 0;
  //根据骰子类型就行异步投掷，返回生成的骰子
  async roll(diceType: string): Promise<Dice> {
    let dice = await this.dicesPlugin.roll(diceType);
    dice = subscribe(dice, "value", async () => {
      let totalRollValue = 0;
      for (const item of this.dices) {
        totalRollValue += (await item).getValue();
      }
      if (this.proxy.value !== totalRollValue) {
        this.proxy.value = totalRollValue;
      }
      //  console.log(this.proxy.value);
    });
    this.proxy.dices.push(dice);
    return dice;
  }
  //异步投掷多个
  rollndx = async (n: number, x: string) => {
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        this.roll(x);
      }, 50 * i);
    }
    return Promise.all(this.dices);
  };
  //t通过指令投掷
  rollXdY = async (xdy: string) => {
    const regex = /(\d*)d(\d+)/g;
    const matches = xdy.matchAll(regex);
    const dices = Array.from(matches, (match) => {
      const count = match[1] === "" ? 1 : parseInt(match[1]);
      const sides = parseInt(match[2]);

      return this.rollndx(count, "d" + sides);
    });
    return Promise.all(dices);
  };
  getValue = () => {
    return this.value;
  };
  getResult = async () => {
    await Promise.all(this.dices);
    const resultValueList = [] as Promise<number>[];
    let resultValue = 0;
    for (const dice of this.dices) {
      const diceIns = await dice;
      resultValueList.push(diceIns.getResultValue());
      diceIns.getResultValue().then((result) => {
        resultValue = resultValue + result;
      });
    }
    await Promise.all(resultValueList);
    const result = {
      dices: this.dices,
      resultValue: resultValue,
      resultValueList: resultValueList,
    };
    return result;
  };

  toString() {
    let des = this.value + "";
    for (const item of this.dices) {
      const itemIns = item as Dice;
      des += `,` + itemIns.value;
    }
    des = des.replace(",", "[") + `]`;
    return des;
  }
  // //异步投掷，并选取其中一定数量
  // rollndxKy = async (
  //   n: number,
  //   x: string,
  //   y: number,
  //   adv: boolean,
  //   dis: boolean
  // ) => {
  //   const dices = await this.rollndx(n, x);
  //   const dicesSort = (a, b) => {
  //     const isABiger = a > b;
  //     let order = -1;
  //     if (isABiger) order = 1;
  //     if (dis && !adv) order *= -1;
  //     return order;
  //   };
  //   const picks = [] as Dice[];
  //   for (const dice of dices) {
  //     picks.push(dice);
  //   }
  //   picks.sort(dicesSort);
  //   for (let i = 0; i < n - y; i++) {
  //     picks.pop();
  //   }
  //   return { dices: dices, picks: picks };
  // };
  dicesPlugin!: DicesPlugin;
  constructor(dicesplugin: DicesPlugin) {
    this.proxy = this;
    this.dicesPlugin = dicesplugin;
  }
}
export { Roller };
export type { DicesPlugin, Dice };
