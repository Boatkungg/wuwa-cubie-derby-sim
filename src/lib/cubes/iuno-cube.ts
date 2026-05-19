import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Iuno Cube: When this Cube passes through the midpoint, teleport all 
 * non-Abbowser Cubes ahead and behind to its pad. The Cubes are stacked 
 * based on their previous positions. This effect can only be 
 * triggered once per match.
 */
export default class IunoCube extends BaseCube {
  static override displayName: string = "Iuno Cube";
  name = IunoCube.displayName;
  
  public reachedMidpoint: boolean = false;
  public hasActivated: boolean = false;

  public override onMove(game: Game): void {
    /* WARN: As the information about how Iuno Cube activates when pass through
     * the midpoint is not clear (IDK about where is midpoint but I will assume
     * that it will activates when it move and lands on pad in the middle of the track
     * +- 1 pads)
     */
    const currentPosition = game.getCubePosition({
      cube: this,
    });
    if (currentPosition === undefined) {
      return;
    }

    const midpoint = Math.floor(game.pads.length / 2);
    if (Math.abs(currentPosition - midpoint) <= 1) {
      this.reachedMidpoint = true;
    }
  }

  public override onAfterMove(game: Game): void {
    if (this.hasActivated) {
      return;
    }
    
    const currentPosition = game.getCubePosition({
      cube: this,
    });
    if (currentPosition === undefined) {
      return;
    }

    if (this.reachedMidpoint) {
      // Move the cubes according to the ranking to the same pad as Iuno Cube
      const ranking = game.getCubeRanking();
      for (const cube of ranking) {
        if (cube.name !== this.name && cube.name !== "Abbowser Cube") {
          game.moveCubeTo({
            cube,
            padIndex: currentPosition,
          })
        }
      }
      
      this.hasActivated = true;
    }
  }
}
