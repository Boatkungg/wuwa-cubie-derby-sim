import type { BaseCube } from "./cube";
import { modulo, shuffleArray } from "./utils";

export type PadType = "normal" | "forward" | "backward" | "shuffle";

export interface TrackPad {
  padType: PadType;
  cubesOnPad: BaseCube[];
}

export interface GameState {
  pads: TrackPad[];
  cubes: BaseCube[];
  actionOrders: BaseCube[];
  ranking: BaseCube[];
  currentTurn: number;
  trackLength: number;
  laps: number;
}

export class Game {
  public pads: TrackPad[] = [];
  public cubes: BaseCube[] = [];
  public actionOrders: BaseCube[] = [];
  public currentTurn: number = 1;
  public trackLength: number;
  public laps: number;
  public currentLap: number;

  constructor({
    trackLength,
    laps = 1,
    currentLap = 1,
  }: {
    trackLength: number;
    laps?: number;
    currentLap?: number;
  }) {
    this.trackLength = trackLength;
    this.laps = laps;
    this.currentLap = currentLap;
    for (let i = 0; i < trackLength; i++) {
      this.pads.push({ padType: "normal", cubesOnPad: [] });
    }
  }

  public addCube({
    cube,
    position = 0,
  }: {
    cube: BaseCube;
    position?: number;
  }) {
    // Ensure that there is no same cube on the track
    if (this.cubes.find((c) => c.name === cube.name)) {
      throw new Error(
        `Cube with name ${cube.name} already exists on the track.`,
      );
    }

    // Place the cube in the specified position (allow negative index)
    this.cubes.push(cube);
    this.pads.at(position)?.cubesOnPad.push(cube);
  }

  public getCubePosition({ cube }: { cube: BaseCube }) {
    for (const [index, pad] of this.pads.entries()) {
      if (pad.cubesOnPad.find((c) => c.name === cube.name)) {
        return index;
      }
    }
  }

  public MoveCube({
    cube,
    side,
  }: {
    cube: BaseCube;
    side: "forward" | "backward";
  }) {
    // Get the current position of the cube
    const currentPosition = this.getCubePosition({ cube });
    if (currentPosition === undefined) {
      throw new Error(`Cube ${cube.name} is not on the track.`);
    }

    const currentPad = this.pads.at(currentPosition);

    // Get the stack of cubes from the current cube to the top of the stack
    const currentStackPosition = currentPad?.cubesOnPad.findIndex(
      (c) => c.name === cube.name,
    );
    const cubesToMove =
      currentPad?.cubesOnPad.splice(currentStackPosition!) ?? [];

    const nextPosition =
      side === "forward" ? currentPosition + 1 : currentPosition - 1;
    const moduloNextPosition = modulo(nextPosition, this.trackLength);
    const nextPad = this.pads.at(moduloNextPosition);

    // Check if we need to add or subtract laps
    if (nextPosition >= this.trackLength) {
      cubesToMove.forEach((c) => {
        c.lap += 1;
        this.currentLap = Math.max(this.currentLap, c.lap);
      });
    } else if (nextPosition < 0) {
      cubesToMove.forEach((c) => {
        c.lap = Math.max(1, c.lap - 1);
      });
    }

    const nextPadCubes = nextPad?.cubesOnPad ?? [];

    // Move the cubes to the next pad
    nextPad?.cubesOnPad.push(...cubesToMove);

    // Run encounter effects for all cubes involved in the move
    for (const movingCube of cubesToMove) {
      for (const encounteredCube of nextPadCubes) {
        movingCube.onEncounter(this, encounteredCube);
        encounteredCube.onEncounter(this, movingCube);
      }
    }

    // Run onMove effects for the main moving cube
    cube.onMove(this);
  }

  public moveCubeTo({ cube, padIndex }: { cube: BaseCube; padIndex: number }) {
    const currentPosition = this.getCubePosition({ cube });
    if (currentPosition === undefined) {
      throw new Error(`Cube ${cube.name} is not on the track.`);
    }

    // Get and validate the current pad and the new pad
    const currentPad = this.pads.at(currentPosition);
    if (!currentPad) {
      throw new Error(
        `Current pad at position ${currentPosition} does not exist.`,
      );
    }

    const newPad = this.pads.at(padIndex);
    if (!newPad) {
      throw new Error(`Target pad at position ${padIndex} does not exist.`);
    }

    // Remove the cube from its current pad
    const cubeIndex = currentPad.cubesOnPad.findIndex(
      (c) => c.name === cube.name,
    );
    if (cubeIndex === -1) {
      throw new Error(`Cube ${cube.name} is not on the current pad.`);
    }
    currentPad.cubesOnPad.splice(cubeIndex, 1);

    // Add the cube to the new pad
    newPad.cubesOnPad.push(cube);
  }

  public setCubeStackIndex({
    cube,
    stackIndex,
  }: {
    cube: BaseCube;
    stackIndex: number;
  }) {
    const currentPosition = this.getCubePosition({ cube });
    if (currentPosition === undefined) {
      throw new Error(`Cube ${cube.name} is not on the track.`);
    }

    const currentPad = this.pads.at(currentPosition);
    if (!currentPad) {
      throw new Error(
        `Current pad at position ${currentPosition} does not exist.`,
      );
    }

    const cubeIndex = currentPad.cubesOnPad.findIndex(
      (c) => c.name === cube.name,
    );
    if (cubeIndex === -1) {
      throw new Error(`Cube ${cube.name} is not on the current pad.`);
    }

    // Remove the cube from its current position in the stack
    currentPad.cubesOnPad.splice(cubeIndex, 1);

    // Calculate actual index to support negative indexing
    const actualIndex = modulo(stackIndex, currentPad.cubesOnPad.length + 1);

    // Insert the cube at the new stack index
    currentPad.cubesOnPad.splice(actualIndex, 0, cube);
  }

  public getCubeRanking({
    winnableOnly = true,
  }: { winnableOnly?: boolean } = {}) {
    const sortedRanking = [...this.pads]
      .flatMap((pad, padIndex) =>
        pad.cubesOnPad.map((cube, stackIndex) => ({
          cube,
          stackIndex,
          padIndex,
        })),
      )
      // Sort by lap first, then by pad index, and finally by stack index (top of the stack is ahead)
      .sort(
        (a, b) =>
          b.cube.lap - a.cube.lap ||
          b.padIndex - a.padIndex ||
          b.stackIndex - a.stackIndex,
      )
      .map((entry) => entry.cube);

    if (winnableOnly) {
      return sortedRanking.filter((cube) => cube.isWinnable);
    }

    return sortedRanking;
  }

  public isWinnerFound() {
    const ranking = this.getCubeRanking({ winnableOnly: true });
    const winner = ranking[0];
    if (!winner) {
      return false; // No winner yet
    }

    // Check if the winner is on the last pad and has completed the required laps
    const winnerPosition = this.getCubePosition({ cube: winner });
    if (winnerPosition === this.trackLength - 1 && winner.lap >= this.laps) {
      return true; // Winner found
    }
    return false; // No winner yet
  }

  public isCubeFurthestBehindAlone({ cube }: { cube: BaseCube }) {
    const cubePosition = this.getCubePosition({ cube });
    if (cubePosition === undefined) {
      throw new Error(`Cube ${cube.name} is not on the track.`);
    }

    const currentPad = this.pads.at(cubePosition);
    if (!currentPad || currentPad.cubesOnPad.length !== 1) {
      return false; // Not alone on the pad
    }

    // Check if there are any other cubes on pads behind the current cube
    for (let i = 0; i < cubePosition; i++) {
      const pad = this.pads.at(i);
      if (pad && pad.cubesOnPad.length > 0) {
        return false; // There are cubes behind the current cube
      }
    }

    return true; // The cube is alone and furthest behind
  }

  public shuffleCubesOnPad({ padIndex }: { padIndex: number }) {
    const pad = this.pads.at(padIndex);
    if (!pad) {
      throw new Error(`Pad at index ${padIndex} does not exist.`);
    }

    // Shuffle the cubes on the pad
    pad.cubesOnPad = shuffleArray(pad.cubesOnPad);

    // Run afterPadShuffle effects for all cubes on the pad
    for (const cube of pad.cubesOnPad) {
      cube.afterPadShuffleCubes(this);
    }
  }

  public getOutput() {
    return {
      pads: [...this.pads],
      cubes: [...this.cubes],
      actionOrders: [...this.actionOrders],
      ranking: this.getCubeRanking(),
      currentTurn: this.currentTurn,
      trackLength: this.trackLength,
      laps: this.laps,
    } as GameState;
  }

  public shuffleActionOrder() {
    this.actionOrders = shuffleArray(this.cubes);
  }

  public setActionOrderIndex({
    cube,
    orderIndex,
  }: {
    cube: BaseCube;
    orderIndex: number;
  }) {
    const currentIndex = this.actionOrders.findIndex(
      (c) => c.name === cube.name,
    );
    if (currentIndex === -1) {
      throw new Error(`Cube ${cube.name} is not in the action order list.`);
    }

    // Remove the cube from its current position in the action order
    this.actionOrders.splice(currentIndex, 1);

    // Calculate actual index to support negative indexing
    const actualIndex = modulo(orderIndex, this.actionOrders.length + 1);

    // Insert the cube at the new action order index
    this.actionOrders.splice(actualIndex, 0, cube);
  }

  public rollAllDice() {
    for (const cube of this.cubes) {
      cube.rollDice(this);
    }
  }

  public startTurn() {
    const prioritySortedCubes = [...this.cubes].sort(
      (a, b) => b.abilityPriority - a.abilityPriority,
    );

    for (const cube of prioritySortedCubes) {
      cube.onTurnStart(this);
    }
  }

  public endTurn() {
    const prioritySortedCubes = [...this.cubes].sort(
      (a, b) => b.abilityPriority - a.abilityPriority,
    );

    for (const cube of prioritySortedCubes) {
      cube.onTurnEnd(this);
    }
  }

  public triggerOtherCubeLanded({ cube }: { cube: BaseCube }) {
    const cubePosition = this.getCubePosition({ cube });
    if (cubePosition === undefined) {
      throw new Error(`Cube ${cube.name} is not on the track.`);
    }

    const currentPad = this.pads.at(cubePosition);
    if (!currentPad) {
      throw new Error(
        `Current pad at position ${cubePosition} does not exist.`,
      );
    }

    // Trigger onOtherCubeLanded of the cubes below the current cube in the stack
    const currentStackIndex = currentPad.cubesOnPad.findIndex(
      (c) => c.name === cube.name,
    );

    for (let i = currentStackIndex - 1; i >= 0; i--) {
      const otherCube = currentPad.cubesOnPad[i];
      otherCube?.onOtherCubeLanded(this, cube);
    }
  }

  public *moveCubeBy({ cube, steps }: { cube: BaseCube; steps: number }) {
    for (let step = 0; step < Math.abs(steps); step++) {
      const side = steps > 0 ? "forward" : "backward";
      this.MoveCube({ cube, side });

      if (this.isWinnerFound()) {
        return;
      }

      yield this.getOutput();
    }
  }

  public *startMatch() {
    this.currentTurn = 1;

    while (!this.isWinnerFound()) {
      this.shuffleActionOrder();
      if (this.currentTurn === 1 && this.currentLap === 1) {
        // On the first turn of the first lap, we set the stack order based on the action orders
        // at the first pad
        for (const cube of this.actionOrders) {
          if (cube.isWinnable) {
            this.setCubeStackIndex({
              cube,
              stackIndex: 0,
            });
          }
        }
      }
      this.rollAllDice();

      this.startTurn();
      yield this.getOutput();

      for (const cube of this.actionOrders) {
        // Move the cube according to its final steps, which may be modified by its abilities
        cube.onBeforeMove(this);

        const finalSteps = cube.getFinalSteps(this);
        yield* this.moveCubeBy({ cube, steps: finalSteps });

        if (this.isWinnerFound()) {
          break;
        }

        // Handle pads effects
        while (true && !this.isWinnerFound()) {
          const cubePosition = this.getCubePosition({ cube });
          if (cubePosition === undefined) {
            throw new Error(`Cube ${cube.name} is not on the track.`);
          }

          const currentPad = this.pads.at(cubePosition);
          if (!currentPad) {
            throw new Error(
              `Current pad at position ${cubePosition} does not exist.`,
            );
          }

          const padType = currentPad.padType;

          if (padType === "forward") {
            const forwardSteps = cube.getForwardPadSteps(this);
            yield* this.moveCubeBy({ cube, steps: forwardSteps });
          } else if (padType === "backward") {
            const backwardSteps = cube.getBackwardPadSteps(this);
            yield* this.moveCubeBy({ cube, steps: backwardSteps });
          } else if (padType === "shuffle") {
            if (cube.allowShufflePad(this)) {
              this.shuffleCubesOnPad({ padIndex: cubePosition });
              yield this.getOutput();
              break; // After shuffling, we break to avoid infinite loop of pad effects
            }
          } else {
            break; // No more pad effects to process
          }
        }

        cube.onAfterMove(this);
        
        this.triggerOtherCubeLanded({ cube });
        yield this.getOutput();

        if (this.isWinnerFound()) {
          break;
        }
      }

      if (this.isWinnerFound()) {
        break;
      }

      this.endTurn();
      this.currentTurn++;
    }

    yield this.getOutput(); // Final output with the winner
  }
}
