import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";
import { random } from "../core/random";

/**
 * Lynae Cube: For each turn, there is a 60% chance to advance by a doubled number, 
 * but also a 20% chance to stay still.
 */
export default class LynaeCube extends BaseCube {
  static override displayName: string = "Lynae Cube";
  name = LynaeCube.displayName;
  
  public stayStill: boolean = false;

  public override onTurnStart() {
    // WARN: This use hardcoded random function that can't be customized when calling this method
    const rand = random();

    if (rand < 0.2) {
      // 20% chance to stay still
      this.stayStill = true;
    } else if (rand < 0.8) {
      // 60% chance to advance by a doubled number
      this.stepModifier += this.rollResult;
    }
  }

  public override getFinalSteps(game: Game) {
    if (this.stayStill) {
      return 0; // Stay still
    }
    return super.getFinalSteps(game); // Use the normal calculation for movement
  }

  public override onTurnEnd(game: Game) {
    this.stayStill = false; // Reset for the next turn
    return super.onTurnEnd(game);
  }
}
