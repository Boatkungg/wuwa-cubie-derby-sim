import { Game } from "../../core/game";

export default function eliminatorMap2026({
  laps = 1,
  currentLap = 1,
}: { laps?: number; currentLap?: number } = {}) {
  const game = new Game({
    trackLength: 32,
    laps,
    currentLap,
  });

  game.pads[3]!.padType = "forward";
  game.pads[5]!.padType = "shuffle";
  game.pads[9]!.padType = "forward";
  game.pads[13]!.padType = "shuffle";
  game.pads[15]!.padType = "backward";
  game.pads[19]!.padType = "forward";
  game.pads[22]!.padType = "shuffle";
  game.pads[25]!.padType = "backward";
  game.pads[29]!.padType = "backward";

  return game;
}

eliminatorMap2026.displayName = "Eliminator (2026)";
