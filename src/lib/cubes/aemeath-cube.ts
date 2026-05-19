import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Aemeath Cube: When this Cube reaches the course's midpoint, it
 * teleports on top of the closest Cube (if that Cube is not
 * Abbowser). This can be triggered only once per match.
 */
export default class AemeathCube extends BaseCube {
  static override displayName: string = "Aemeath Cube";
  name = AemeathCube.displayName;
  
  public reachedMidpoint: boolean = false;
  public hasActivated: boolean = false;

  public override onMove(game: Game) {
    /* WARN: As the information about how Aemeath Cube activates when reaches
     * the course's midpointis not clear (IDK about where is midpoint but
     * I will assume that it will activates when it move pass the middle of the
     * track +- 2 pads)
     */
    const currentPosition = game.getCubePosition({
      cube: this,
    });
    if (currentPosition === undefined) {
      return;
    }

    const midpoint = Math.floor(game.pads.length / 2);
    if (Math.abs(currentPosition - midpoint) <= 2) {
      this.reachedMidpoint = true;
    }
  }

  public override onAfterMove(game: Game) {
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
      /* WARN: I only see that Aemeath Cube will teleport to the nearest cube ahead
       * so I will only check the cubes ahead of Aemeath Cube
       */
      for (let i = currentPosition + 1; i < game.pads.length; i++) {
        const pad = game.pads[i]!;
        if (
          pad.cubesOnPad.length > 0 &&
          pad.cubesOnPad.at(-1)?.name !== "Abbowser Cube"
        ) {
          game.moveCubeTo({
            cube: this,
            padIndex: i,
          });

          this.hasActivated = true;
          break;
        }
      }
    }
  }
}
