import type { Game, PadType } from "./game";
import { random as defaultRandom } from "./random";

export abstract class BaseCube {
  static readonly displayName: string;
  public abstract name: string;
  public isWinnable: boolean = true;
  public isStackable: boolean = true;
  public dice: number[] = [1, 2, 3];
  public moveSide: number = 1; // 1 = forward, -1 = backward
  public rollResult: number = 0;
  public stepModifier: number = 0;
  public abilityPriority: number = 0; // Higher value means higher priority
  public lap: number;

  constructor({ lap = 1 }: { lap?: number } = {}) {
    this.lap = lap;
  }

  public rollDice(game: Game, randomFn: () => number = defaultRandom) {
    const rollResult = this.dice[Math.floor(randomFn() * this.dice.length)];
    this.rollResult = rollResult!;
  }

  public getFinalSteps(game: Game) {
    return Math.max(1, this.rollResult + this.stepModifier) * this.moveSide;
  }

  public onTurnStart(game: Game) {}

  public onTurnEnd(game: Game) {
    this.stepModifier = 0; // Reset step modifier after each turn
  }

  public onBeforeMove(game: Game) {}

  public onMove(game: Game) {}

  public onAfterMove(game: Game) {}

  public onOtherCubeLanded(game: Game, otherCube: BaseCube) {}

  public onEncounter(game: Game, encounteredCube: BaseCube) {}

  public afterPadShuffleCubes(game: Game) {}

  public getForwardPadSteps(game: Game) {
    return 1;
  }

  public getBackwardPadSteps(game: Game) {
    return -1;
  }

  public allowShufflePad(game: Game) {
    return true;
  }
}
