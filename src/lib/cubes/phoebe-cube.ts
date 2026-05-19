import { BaseCube } from "../core/cube";
import { type Game } from "../core/game";
import { random } from "../core/random";

/**
 * Phoebe Cube: There is a 50% chance to advance an extra pad.
 */
export default class PhoebeCube extends BaseCube {
  static override displayName: string = "Phoebe Cube";
  name = PhoebeCube.displayName;

  public override onTurnStart(game: Game): void {
    // WARN: This use hardcoded random function that can't be customized when calling this method
    const rand = random();

    if (rand < 0.5) {
      this.stepModifier += 1;
    }
  }
}
