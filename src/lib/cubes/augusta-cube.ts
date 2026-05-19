import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Augusta Cube: When at the top of a stack at the start of the turn,
 * this Cube stays still this turn and becomes the last
 * to move the next turn.
 */
export default class AugustaCube extends BaseCube {
  static override displayName: string = "Augusta Cube";
  name = AugustaCube.displayName;

  public stayStillThisTurn: boolean = false;
  public shouldBeLastNextTurn: boolean = false;

  public override onTurnStart(game: Game): void {
    if (this.shouldBeLastNextTurn) {
      game.setActionOrderIndex({
        cube: this,
        orderIndex: -1,
      });
      this.shouldBeLastNextTurn = false;
    }

    const currentPosition = game.getCubePosition({ cube: this });
    if (currentPosition === undefined) {
      return;
    }

    const currentPad = game.pads.at(currentPosition);
    if (currentPad === undefined) {
      return;
    }

    if (currentPad.cubesOnPad.at(-1) === this) {
      this.stayStillThisTurn = true;
      this.shouldBeLastNextTurn = true;
    }
  }

  public override getFinalSteps(game: Game): number {
    if (this.stayStillThisTurn) {
      return 0;
    }
    return super.getFinalSteps(game);
  }

  public override onTurnEnd(game: Game): void {
    this.stayStillThisTurn = false;
    super.onTurnEnd(game);
  }
}
