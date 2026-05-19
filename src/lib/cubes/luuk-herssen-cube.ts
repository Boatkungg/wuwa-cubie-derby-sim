import { BaseCube } from "../core/cube";

/**
 * Luuk Herssen Cube: Triggering the Thruster pushes this Cube forward by 2 extra pads.
 * Triggering the Blocker knocks this Cube back by 1 extra pad.
 */
export default class LuukHerssenCube extends BaseCube {
  static override displayName: string = "Luuk Herssen Cube";
  name = LuukHerssenCube.displayName;

  public override getForwardPadSteps() {
    return 3;
  }

  public override getBackwardPadSteps() {
    return 2;
  }
}
