import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";
import { random } from "../core/random";

/**
 * Changli Cube: If other Cubes are stacked below Changli, there is
 * a 65% chance she will be the last to move in the next turn.
 */
export default class ChangliCube extends BaseCube {
  static override displayName: string = "Changli Cube";
  name = ChangliCube.displayName;
  
  public activateLastMove: boolean = false;

  public override onTurnStart(game: Game): void {
    if (this.activateLastMove) {
      game.setActionOrderIndex({
        cube: this,
        orderIndex: -1,
      });
    }
  }

  public override onTurnEnd(game: Game): void {
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
    if (currentStackIndex > 0) {
      // There are cubes stacked below Changli
      // WARN: This use hardcoded random function that can't be customized when calling this method
      const rand = random();
      if (rand < 0.65) {
        this.activateLastMove = true;
        return;
      }
    }

    this.activateLastMove = false;
  }
}
