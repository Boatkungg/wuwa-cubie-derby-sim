import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Denia Cube: If the number rolled matches the previous roll,
 * this Cube advances 2 extra pads.
 */
export default class DeniaCube extends BaseCube {
  static override displayName: string = "Denia Cube";
  name = DeniaCube.displayName;

  public previousRoll: number = 0;

  public override onTurnStart(_game: Game): void {
    if (this.previousRoll === this.rollResult && this.previousRoll !== 0) {
      this.stepModifier += 2;
    }
  }

  public override rollDice(game: Game, randomFn?: () => number): void {
    this.previousRoll = this.rollResult;
    super.rollDice(game, randomFn);
  }
}
