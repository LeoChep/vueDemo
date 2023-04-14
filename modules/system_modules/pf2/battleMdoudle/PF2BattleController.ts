import type {
  Battle,
  BattleController,
  Joiner,
} from "@/system_modules/BattleController";

class PF2Battle implements Battle {
  round = 0;
  activityJoiner!: Joiner;
  joiners: Joiner[] = [];
  pushJoiner(joiner: Joiner): void {
    this.joiners.push(joiner);
  }
}
class PF2BattleContoller implements BattleController {
  battle!: Battle;
  static createBattle(joiners: Joiner[]): Battle {
    const battle = new PF2Battle();
    battle.joiners = joiners;
    return battle;
  }
  initBattle(): void {}
  startTurn(joiner: Joiner): void {}
  endTurn(joiner: Joiner): void {}
  startRound(round: number): void {}
  endRound(): void {}
  close(): void {}
}
export { PF2BattleContoller };
