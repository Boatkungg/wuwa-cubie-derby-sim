import { Game } from "../../core/game";

export default function preliminaryMap2026({
  laps = 1,
  currentLap = 1,
}: { laps?: number; currentLap?: number } = {}) {
  const game = new Game({
    trackLength: 32,
    laps,
    currentLap,
  });

  game.pads[2]!.padType = "forward";
  game.pads[5]!.padType = "shuffle";
  game.pads[9]!.padType = "backward";
  game.pads[10]!.padType = "forward";
  game.pads[15]!.padType = "forward";
  game.pads[19]!.padType = "shuffle";
  game.pads[22]!.padType = "forward";
  game.pads[27]!.padType = "backward";

  return game;
}

preliminaryMap2026.displayName = "Preliminary (2026)";
