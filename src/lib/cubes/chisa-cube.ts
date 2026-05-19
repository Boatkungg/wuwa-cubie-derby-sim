import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Chisa Cube: If this turn's roll is the lowest among all Cubes,
 * this Cube advances 2 extra pads.
 */
export default class ChisaCube extends BaseCube {
  static override displayName: string = "Chisa Cube";
  name = ChisaCube.displayName;

  public override onTurnStart(game: Game) {
    for (const cube of game.cubes) {
      if (!cube.isWinnable && game.currentTurn < 3) {
        // WARN: Skip the Abbowser Cube checking since it can't roll in the first 2 turns
        continue;
      }
      if (cube.rollResult < this.rollResult) {
        return;
      }
    }

    // This Cube has the lowest roll result, advance 2 extra pads
    this.stepModifier += 2;
  }
}
