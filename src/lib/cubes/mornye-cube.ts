import { BaseCube } from "../core/cube";

/**
 * Mornye Cube: The dice is set to roll 3, 2, and 1 in succession.
 */
export default class MornyeCube extends BaseCube {
  static override displayName: string = "Mornye Cube";
  name = MornyeCube.displayName;

  public override rollDice() {
    switch (this.rollResult) {
      case 1:
        this.rollResult = 3;
        break;
      case 2:
        this.rollResult = 1;
        break;
      case 3:
        this.rollResult = 2;
        break;
      default:
        this.rollResult = 3; // Start with 3 on the first roll
    }
  }
}
