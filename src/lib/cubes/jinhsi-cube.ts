import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";
import { random } from "../core/random";

/**
 * Jinhsi Cube: If other Cubes are stacked on top of Jinhsi, there
 * is a 40% chance she will move to the top of the stack.
 */
export default class JinhsiCube extends BaseCube {
  static override displayName: string = "Jinhsi Cube";
  name = JinhsiCube.displayName;

  public override onOtherCubeLanded(game: Game, otherCube: BaseCube) {
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
    const otherStackIndex = currentPad.cubesOnPad.findIndex(
      (c) => c.name === otherCube.name,
    );

    /* WARN: I'm not sure if it will trigger when Jinhsi isn't at the top before
     * other cube landed, but I'm assuming it will only trigger when Jinhsi is
     * directly below the other cube after it landed
     */
    if (currentStackIndex + 1 === otherStackIndex) {
      // WARN: This use hardcoded random function that can't be customized when calling this method
      const rand = random();
      if (rand < 0.4) {
        game.setCubeStackIndex({
          cube: this,
          stackIndex: -1,
        });
      }
    }
  }
}
