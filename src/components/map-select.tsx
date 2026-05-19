"use client";

import { Game, type PadType } from "@/lib/core/game";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import * as maps from "@/lib/maps";
import { formatMapName } from "@/lib/core/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";

export type MapGeneratorFn = (params?: {
  laps?: number;
  currentLap?: number;
}) => Game;

export interface customMapPad {
  id: string;
  padType: PadType;
}

interface MapSelectProps {
  onSelectAction?: (mapGeneratorFn: MapGeneratorFn) => void;
}

function getRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  const template = "10000000-1000-4000-8000-100000000000";
  return template.replace(/[018]/g, (cStr) => {
    const c = parseInt(cStr, 10);
    const arr = new Uint8Array(1);
    crypto.getRandomValues(arr);
    return (c ^ (arr[0]! & (15 >> (c / 4)))).toString(16);
  });
}

export default function MapSelect({ onSelectAction }: MapSelectProps) {
  const [makeCustomMap, setMakeCustomMap] = useState<boolean>(false);
  const [customMapPads, setCustomMapPads] = useState<customMapPad[]>([]);

  const generateCustomMapFn = (pads: customMapPad[]) => {
    if (!onSelectAction) return;

    const func = ({ laps = 1, currentLap = 1 } = {}) => {
      const game = new Game({
        trackLength: pads.length,
        laps,
        currentLap,
      });

      pads.forEach((pad, index) => {
        if (game.pads[index]) {
          game.pads[index].padType = pad.padType;
        }
      });

      return game;
    };

    onSelectAction(func);
  };

  const handleSelectValueChange = (value: string) => {
    const mapGenerator = maps[value as keyof typeof maps] as MapGeneratorFn;
    console.log("Selected map generator:", mapGenerator);
    onSelectAction?.(mapGenerator);
  };

  const handlePadNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numPads = parseInt(e.target.value, 10);
    let newPads: customMapPad[] = [];

    if (!Number.isNaN(numPads) && numPads >= 0) {
      newPads = [...customMapPads];
      while (newPads.length < numPads) {
        newPads.push({
          id: `pad-${getRandomId()}`,
          padType: "normal",
        });
      }
      while (newPads.length > numPads) {
        newPads.pop();
      }
    }

    setCustomMapPads(newPads);
    generateCustomMapFn(newPads);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Map</CardTitle>
        <CardAction>
          <Button
            onClick={() => setMakeCustomMap((prev) => !prev)}
            variant="outline"
          >
            {makeCustomMap ? "Use Preset Maps" : "Make Custom Map"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {!makeCustomMap ? (
          <Select onValueChange={handleSelectValueChange}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Map" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(maps).map(([key, mapGenerator]) => (
                  <SelectItem key={key} value={key}>
                    {formatMapName(mapGenerator.name)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              type="number"
              min={0}
              placeholder="Number of pads..."
              value={customMapPads.length || ""}
              onChange={handlePadNumberChange}
              className="max-w-xs"
            />

            <div className="flex flex-wrap gap-2">
              {customMapPads.map((pad, index) => (
                <Select
                  key={pad.id}
                  value={pad.padType}
                  onValueChange={(value) => {
                    const newPads = [...customMapPads].map((p) =>
                      p.id === pad.id ? { ...p, padType: value as PadType } : p,
                    );

                    setCustomMapPads(newPads);
                    generateCustomMapFn(newPads);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={`Pad ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="normal">
                        {index + 1}: Normal
                      </SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="backward">Backward</SelectItem>
                      <SelectItem value="shuffle">Shuffle</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
