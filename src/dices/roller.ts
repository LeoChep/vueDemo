interface DicesPlugin {
  roll: (diceType: string) => Promise<Dice>;
  cleanDices();
}
interface Dice {
  //异步类
  resultValue: Promise<number>; //结果数值
  value: number; //当前数值
  getValue: () => number;
  getResultValue: () => Promise<number>;
}
export default {};
class Roller {
  dices = [] as Promise<Dice>[];
  //根据骰子类型就行异步投掷，返回结果
  roll(diceType: string): Promise<Dice> {
    const dice = this.dicesPlugin.roll(diceType);
    this.dices.push(dice);
    return dice;
  }
  //异步投掷多个
  rollndx = async (n: number, x: string) => {
    for (let i = 0; i < n; i++) {
      this.roll(x);
    }

    return Promise.all(this.dices);
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
    this.dicesPlugin = dicesplugin;
  }
}
export { Roller };
export type { DicesPlugin, Dice };
