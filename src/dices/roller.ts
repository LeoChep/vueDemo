interface DicesPlugin {
  roll: (diceType: string) => Promise<Dice>;
  cleanDices();
}
interface Dice {
  resultValue: Promise<number>;
}
export default {};
class Roller {
  //根据骰子类型就行异步投掷，返回结果
  roll(diceType: string): Promise<Dice> {
    return this.dicesPlugin.roll(diceType);
  }
  //异步投掷多个
  rollndx = async (n: number, x: string) => {
    const dices = [] as Promise<Dice>[];
    for (let i = 0; i < n; i++) {
      const dice = this.roll(x);
      dices.push(dice);
    }

    return Promise.all(dices);
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
