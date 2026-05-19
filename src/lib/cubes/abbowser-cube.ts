import { BaseCube } from "../core/cube";
import type { Game } from "../core/game";

/**
 * Abbowser Cube: In the 3rd turn, Abbowser Cube starts moving from the finish line to the starting line.
 * Abbowser Cube does not stack with other Cubes before it starts moving. Once it's
 * moving, it is also affected by all mechanisms along the course. Abbowser Cube rolls
 * from 1-6, always ends up at the bottom of the stack. If Abbowser is separated from all
 * other Cubes at the end of each turn, it teleports back to the finish line.
 */
export default class AbbowserCube extends BaseCube {
  static override displayName: string = "Abbowser Cube";
  name = AbbowserCube.displayName;
  
  public override dice: number[] = [1, 2, 3, 4, 5, 6];
  public override isWinnable: boolean = false;
  public moveable: boolean = false;
  public override moveSide: number = -1;

  public override onTurnStart(game: Game) {
    if (game.currentTurn >= 3) {
      this.moveable = true;
    }
  }

  public override getFinalSteps(game: Game) {
    // console.log(`Abbowser moveable: ${this.moveable}, rollResult: ${this.rollResult}, stepModifier: ${this.stepModifier}`);
    if (!this.moveable) {
      return 0; // Abbowser does not move until the 3rd turn
    }
    const final = super.getFinalSteps(game);
    // console.log(`Abbowser final steps: ${final}`);
    return final;
  }

  public override onMove(game: Game) {
    game.setCubeStackIndex({
      cube: this,
      stackIndex: 0,
    });
  }

  public override afterPadShuffleCubes(game: Game) {
    game.setCubeStackIndex({
      cube: this,
      stackIndex: 0,
    });
  }

  public override onTurnEnd(game: Game) {
    const isSeparated = game.isCubeFurthestBehindAlone({
      cube: this,
    });

    if (isSeparated) {
      game.moveCubeTo({
        cube: this,
        padIndex: -1,
      });
    }
  }
}
