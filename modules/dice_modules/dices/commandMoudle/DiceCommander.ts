import { DiceCommand } from "./DiceCommand";
import { DiceCommandQueue } from "./DiceCommandQueue";

class DiceCommander {
  conmandQueue: DiceCommandQueue;
  constructor() {
    this.conmandQueue = new DiceCommandQueue();
  }
  excute(command: string) {
    this.conmandQueue.push(new DiceCommand(command));
  }
}
export { DiceCommander };
