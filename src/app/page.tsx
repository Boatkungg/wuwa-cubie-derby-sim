"use client";

import CubeSelect, { CubeConstructor } from "@/components/cube-select";
import MapSelect, { MapGeneratorFn } from "@/components/map-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BaseCube } from "@/lib/core/cube";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  wins: {
    label: "Wins",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface SimulationResult {
  key: string;
  wins: number;
}

export default function Home() {
  const [mapGeneratorFn, setMapGeneratorFn] = useState<
    MapGeneratorFn | undefined
  >(undefined);
  const [selectedCubes, setSelectedCubes] = useState<
    Record<string, CubeConstructor>
  >({});

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationCount, setSimulationCount] = useState<number>(10);
  const [simulationResults, setSimulationResults] = useState<
    Record<string, SimulationResult>
  >({});

  const handleSimulate = () => {
    if (!mapGeneratorFn) return;
    if (!selectedCubes || Object.keys(selectedCubes).length === 0) return;

    setIsSimulating(true);

    try {
      const newSimulationResults: Record<string, SimulationResult> = {};

      for (let i = 0; i < simulationCount; i++) {
        const game = mapGeneratorFn();

        Object.entries(selectedCubes).forEach(
          ([key, { cube: CubeClass, position, lap }]) => {
            const cubeInstance = new CubeClass({ lap });
            game.addCube({
              cube: cubeInstance,
              position,
            });
          },
        );

        let lastRank: BaseCube[] = [];
        for (const output of game.startMatch()) {
          lastRank = output.ranking;
        }

        const winner = lastRank[0];
        if (winner) {
          if (!newSimulationResults[winner.name]) {
            newSimulationResults[winner.name] = {
              key: winner.name,
              wins: 1,
            };
          } else {
            newSimulationResults[winner.name]!.wins += 1;
          }
        }

        setSimulationResults({ ...newSimulationResults });
      }
    } catch (error) {
      console.error("Simulation error:", error);
      setIsSimulating(false);
    }

    setIsSimulating(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="flex h-full w-full max-w-5xl flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-2/3">
          <MapSelect
            onSelectAction={(v) => {
              setMapGeneratorFn(() => v);
            }}
          />
          <CubeSelect
            selectedCubes={selectedCubes}
            onCubesChange={setSelectedCubes}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <Card className="lg:sticky lg:top-0">
            <CardHeader>
              <CardTitle>Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Map Generator Fn: {mapGeneratorFn ? "Selected" : "Not Selected"}
              </p>
              <p>Selected Cubes: {Object.keys(selectedCubes).length}</p>
              <div className="mt-4">
                <ChartContainer
                  config={chartConfig}
                  className="min-h-48 w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={Object.values(simulationResults)}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="key"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="wins" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="simulationCount">Number of Simulations</Label>
                  <Input
                    id="simulationCount"
                    type="number"
                    min={0}
                    value={simulationCount}
                    onChange={(e) =>
                      setSimulationCount(parseInt(e.target.value, 10))
                    }
                  />
                </div>
                <Button onClick={handleSimulate} disabled={isSimulating}>
                  {isSimulating ? "Simulating..." : "Simulate"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
