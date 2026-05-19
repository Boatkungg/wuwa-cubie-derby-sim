import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Sigrika Cube: Up to 2 Cubes right ahead of this Cube at the start of the turn advance 1 fewer pad this
 * turn (the first roll at the start of the match only determines turn order). This effect does
 * not freeze Cubes in place or make them go backwards.
 */
export default class SigrikaCube extends BaseCube {
  static override displayName: string = "Sigrika Cube";  
  name = SigrikaCube.displayName;

  public override onTurnStart(game: Game) {
    if (game.currentTurn !== 1 || game.currentLap !== 1) {
      // Get the current ranking of cubes (lower index means higher rank)
      const ranking = game.getCubeRanking();

      const currentIndex = ranking.findIndex(cube => cube.name === this.name);

      // Apply the effect to up to 2 cubes right ahead of this cube
      for (let i = 1; i <= 2; i++) {
        const targetIndex = currentIndex - i;
        if (targetIndex >= 0) {
          const targetCube = ranking[targetIndex];
          if (targetCube) {
            targetCube.stepModifier -= 1;
          }
        } else {
          break;
        }
      }
    }
  }
}
