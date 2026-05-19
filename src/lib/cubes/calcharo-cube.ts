import { BaseCube } from "../core/cube";
import { Game } from "../core/game";

/**
 * Calcharo Cube: If Calcharo is in last place when he starts moving,
 * he advances 3 extra pads.
 */
export default class CalcharoCube extends BaseCube {
  static override displayName: string = "Calcharo Cube";
  name = CalcharoCube.displayName;

  public override onBeforeMove(game: Game): void {
    const ranking = game.getCubeRanking({ winnableOnly: false });
    const isLast = ranking.at(-1)?.name === this.name;
    
    if (isLast) {
      this.stepModifier += 3;
    }
  }
}
