import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Phrolova Cube: When stacked at the bottom at the start of the
 * turn, this Cube advances 3 extra pads.
 */
export default class PhrolovaCube extends BaseCube {
  static override displayName: string = "Phrolova Cube";
  name = PhrolovaCube.displayName;

  public override onTurnStart(game: Game) {
    const currentPosition = game.getCubePosition({
      cube: this,
    });
    if (currentPosition === undefined) {
      return;
    }

    const currentPad = game.pads.at(currentPosition);
    if (currentPad === undefined) {
      return;
    }
    
    const currentStackIndex = currentPad.cubesOnPad.findIndex(
      (c) => c.name === this.name,
    );

    if (currentStackIndex === 0) {
      // This Cube is at the bottom of the stack, advance 3 extra pads
      this.stepModifier += 3;
    }
  }
}
