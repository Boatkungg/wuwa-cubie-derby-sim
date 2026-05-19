import { BaseCube } from "../core/cube";
import { random } from "../core/random";

/**
 * Carlotta Cube: There is a 28% chance to advance twice with the rolled number.
 */
export default class CarlottaCube extends BaseCube {
  static override displayName: string = "Carlotta Cube";
  name = CarlottaCube.displayName;

  public override onTurnStart() {
    // WARN: This use hardcoded random function that can't be customized when calling this method
    if (random() < 0.28) {
      this.stepModifier += this.rollResult;
    }
  }
}
