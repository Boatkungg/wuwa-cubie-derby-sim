import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";
import { random } from "../core/random";

/**
 * Cartethyia Cube: If ranked last after own action, there is a 60% chance
 * to advance 2 extra pads in all remaining turns. This
 * can only be triggered once in each match.
 */
export default class CartethyiaCube extends BaseCube {
  static override displayName: string = "Cartethyia Cube";
  name = CartethyiaCube.displayName;

  public hasTriggered: boolean = false;
  public extraAdvanceActive: boolean = false;

  public override onTurnStart(game: Game): void {
    if (this.extraAdvanceActive) {
      this.stepModifier += 2;
    }
  }

  public override onAfterMove(game: Game): void {
    if (this.hasTriggered) {
      return;
    }

    const ranking = game.getCubeRanking({ winnableOnly: false });
    const isLast = ranking.at(-1)?.name === this.name;

    if (isLast) {
      // WARN: This uses hardcoded random function that can't be customized when calling this method
      const rand = random();
      if (rand < 0.6) {
        this.hasTriggered = true;
        this.extraAdvanceActive = true;
      }
    }
  }
}
