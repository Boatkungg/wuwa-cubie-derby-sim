import { BaseCube } from "../core/cube";

/**
 * Shorekeeper Cube: The dice will only roll a 2 or 3.
 */
export default class ShorekeeperCube extends BaseCube {
  static override displayName: string = "Shorekeeper Cube";
  name = ShorekeeperCube.displayName;
  
  public override dice: number[] = [2, 3];
}
