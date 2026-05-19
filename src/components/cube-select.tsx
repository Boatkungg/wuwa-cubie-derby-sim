"use client";

import { BaseCube } from "@/lib/core/cube";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import * as cubes from "@/lib/cubes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export interface CubeConstructor {
  cube: new (params?: { lap?: number }) => BaseCube;
  displayName: string;
  position: number;
  lap: number;
}

interface CubeSelectProps {
  selectedCubes: Record<string, CubeConstructor>;
  onCubesChange: (cubes: Record<string, CubeConstructor>) => void;
}

export default function CubeSelect({
  selectedCubes,
  onCubesChange,
}: CubeSelectProps) {
  const handleCheckboxChange = (
    key: string,
    CubeClass: new (params?: { lap?: number }) => BaseCube,
    displayName: string,
    isChecked: boolean,
  ) => {
    const newSelectedCubes = { ...selectedCubes };

    if (isChecked) {
      newSelectedCubes[key] = {
        cube: CubeClass,
        displayName: displayName,
        position: displayName.toLowerCase().startsWith("abbowser") ? -1 : 1,
        lap: 1,
      };
    } else {
      delete newSelectedCubes[key];
    }

    onCubesChange(newSelectedCubes);
  };

  const handleParamChange = (
    key: string,
    param: "position" | "lap",
    value: number,
  ) => {
    if (!selectedCubes[key]) return;

    onCubesChange({
      ...selectedCubes,
      [key]: {
        ...selectedCubes[key],
        [param]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Cube(s)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid scrollbar-thin grid-flow-col grid-rows-3 gap-4 overflow-x-scroll border border-border p-4">
          {Object.entries(cubes).map(([key, CubeClass]) => (
            <label
              key={key}
              className="flex w-32 cursor-pointer flex-col items-start justify-between gap-2 border border-input p-2 transition-all has-checked:border-primary has-checked:bg-primary/10"
            >
              <input
                type="checkbox"
                className="accent-accent-foreground"
                checked={!!selectedCubes[key]}
                onChange={(e) =>
                  handleCheckboxChange(
                    key,
                    CubeClass,
                    CubeClass.displayName,
                    e.target.checked,
                  )
                }
              />
              <span className="select-none">{CubeClass.displayName}</span>
            </label>
          ))}
        </div>

        {Object.keys(selectedCubes).length >= 0 && (
          <div className="grid scrollbar-thin grid-flow-col grid-rows-1 gap-4 overflow-x-scroll border border-border p-4">
            {Object.entries(selectedCubes).map(([key, config]) => (
              <Popover key={key}>
                <PopoverTrigger asChild>
                  <div className="flex w-32 cursor-pointer flex-col items-start justify-between gap-2 border border-input p-2">
                    <span className="select-none">{config.displayName}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`${key}-lap`}>Current Lap</Label>
                      <Input
                        id={`${key}-lap`}
                        type="number"
                        value={config.lap}
                        onChange={(e) =>
                          handleParamChange(
                            key,
                            "lap",
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor={`${key}-position`}>Start Position</Label>
                      <Input
                        id={`${key}-position`}
                        type="number"
                        value={config.position}
                        onChange={(e) =>
                          handleParamChange(
                            key,
                            "position",
                            parseInt(e.target.value, 10) || 1,
                          )
                        }
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
