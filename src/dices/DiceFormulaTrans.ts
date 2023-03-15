const str = "(1d7+(2d6+2d8)*2)+2d6+1d6+4";
interface DiceRoller {
  toString: () => string;
  getValue: () => number;
}
class Formula {
  type = "formula";
  text!: string;
  children = [] as Formula[];
  toString = () => {
    let result = "";
    for (const formulaItem of this.children) {
      if (formulaItem.type === "formula")
        result += "(" + formulaItem.toString() + ")";
      else result += formulaItem.toString();
    }
    return result;
  };
  getValue = () => {
    let result = 0;
    const stock = [] as (number | string)[];
    let top = 0;
    let index = 0;
    while (index < this.children.length) {
      if (this.children[index].type != "opearator")
        stock.push(this.children[index].getValue());
      else stock.push(this.children[index].text);
      if (stock[top - 1] === "*") {
        // console.log((stock[top - 2] as number) + "*" + stock[top]);
        stock[top - 2] = (stock[top - 2] as number) * (stock[top] as number);

        top -= 2;
        stock.pop();
        stock.pop();
      }
      if (stock[top - 1] === "/") {
        stock[top - 2] = (stock[top - 2] as number) / (stock[top] as number);
        top -= 2;
        stock.pop();
        stock.pop();
      }
      index++;
      top++;
    }
    index = 0;
    result = stock[0] as number;
    while (index < stock.length) {
      index++;
      if (stock[index - 1] === "+") {
        result += stock[index] as number;
      }
      if (stock[index - 1] === "-") {
        result -= stock[index] as number;
      }
    }
    return result;
  };
}
class Opearator extends Formula {
  type = "opearator";
  toString = () => {
    return this.text;
  };
}
class Modifier extends Formula {
  type = "modifier";
  toString = () => {
    return this.text;
  };
  getValue = () => {
    return parseInt(this.text);
  };
}
class DiceFormula extends Formula {
  type = "diceFormula";
  diceRoller: DiceRoller | undefined;
  toString = () => {
    if (this.diceRoller != undefined) return this.diceRoller.toString();
    else return "undefined";
  };
  getValue = () => {
    if (this.diceRoller != undefined) return this.diceRoller.getValue();
    else return 0;
  };
}
const parseDiceFormula = (str: string) => {
  //先寻找()优先级
  const text = str;
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
  const resultFormula = new Formula();
  const matchs = raw.split(patt);
  const dicePackRegex = /(\d*)d(\d+)/;
  let formulaIndex = 0;
  let opIndex = 0;
  for (const item of matchs) {
    if (item === "&formula&") {
      //  console.log(formulas[formulaIndex]);
      result.push(formulas[formulaIndex]);
      const formula = parseDiceFormula(formulas[formulaIndex]);
      formula.text = formulas[formulaIndex];
      resultFormula.children.push(formula);
      formulaIndex++;
    } else if (dicePackRegex.test(item)) {
      //     console.log(item);
      result.push(item);
      const df = new DiceFormula();
      df.text = item;
      resultFormula.children.push(df);
    } else {
      const mod = new Modifier();
      mod.text = item;
      resultFormula.children.push(mod);
    }
    if (ops[opIndex] != null && ops[opIndex] != undefined) {
      console.log(ops[opIndex]);
      result.push(ops[opIndex]);
      const op = new Opearator();
      op.text = ops[opIndex];
      resultFormula.children.push(op);
      opIndex++;
    }
  }

  resultFormula.text = text;
  return resultFormula;
};
parseDiceFormula(str);
export { Formula, parseDiceFormula, Opearator, DiceFormula };
export type { DiceRoller };
