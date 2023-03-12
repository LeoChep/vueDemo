const str = "(1d7+(2d6+2d8)*2)+2d6+1d6+4";
interface DiceRoller {
  toString: () => string;
}
class Formula {
  type = "formula";
  text!: string;
  children = [] as Formula[];
}
class Opearator extends Formula {
  type = "opearator";
}
class DiceFormula extends Formula {
  type = "diceFormula";
  diceRoller: DiceRoller | undefined;
}
const parseDiceFormula = (str: string) => {
  //先寻找()优先级
  let point = 0;
  let left = 0;
  let raw = str;
  const formulas = [] as string[];
  const rightArr = [] as number[];
  for (let index = 0; index <= raw.length; index++) {
    if (raw[index] === "(") {
      left++;
      if (left === 1) point = index;
    }
    if (raw[index] === ")") {
      left--;
      if (left === 0) {
        const formula = raw.slice(point + 1, index);
        rightArr.push(index);
        str = str.replace("(" + formula + ")", "&formula&");
        formulas.push(formula);
      }
    }
  }
  console.log(str);
  //寻找操作符
  raw = str;
  const ops = [] as string[];
  const patt = new RegExp(/[+*/-]/);
  for (let index = 0; index <= raw.length; index++) {
    if (patt.test(raw[index])) {
      ops.push(raw[index]);
      str = str.replace(raw[index], "&op&");
    }
  }
  //分割字符串
  const result = [] as string[];
  const resultFormula = [] as Formula[];
  const matchs = raw.split(patt);
  let formulaIndex = 0;
  let opIndex = 0;
  for (const item of matchs) {
    if (item === "&formula&") {
      console.log(formulas[formulaIndex]);
      result.push(formulas[formulaIndex]);
      const formula = new Formula();
      formula.text = formulas[formulaIndex];
      resultFormula.push(formula);
      formula.children = parseDiceFormula(formulas[formulaIndex]);
      formulaIndex++;
    } else {
      console.log(item);
      result.push(item);
      const df = new DiceFormula();
      df.text = item;
      resultFormula.push(df);
    }
    if (ops[opIndex] != null && ops[opIndex] != undefined) {
      console.log(ops[opIndex]);
      result.push(ops[opIndex]);
      const op = new Opearator();
      op.text = ops[opIndex];
      resultFormula.push(op);
      opIndex++;
    }
  }

  console.log(resultFormula);
  for (const item of resultFormula) {
    console.log(item);
  }
  return resultFormula;
};
parseDiceFormula(str);
export { Formula, parseDiceFormula, Opearator, DiceFormula };
export type { DiceRoller };
