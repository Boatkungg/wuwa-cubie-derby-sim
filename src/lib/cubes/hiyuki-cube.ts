import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Hiyuki Cube: Encountering Abbowser Cube causes this Cube to
 * advance by 1 extra pad each turn afterward.
 */
export default class HiyukiCube extends BaseCube {
  static override displayName: string = "Hiyuki Cube";
  name = HiyukiCube.displayName;
  
  public encounteredAbbowser = false;

  public override onTurnStart() {
    if (this.encounteredAbbowser) {
      this.stepModifier += 1; // Advance by 1 extra pad
    }
  }
  
  public override onEncounter(game: Game, encounteredCube: BaseCube) {
    if (encounteredCube.name === "Abbowser Cube") {
      this.encounteredAbbowser = true;
    }
  }
}
