import { useCallback, useEffect, useRef, useState } from "react";
import { AllMonths, AllWeekdays, createBlockers } from "./solver/puzzle";
import { drawBoard } from "./draw";
import { SolutionFinder } from "./solver/algorithm-x";

const CanvasHeight = Math.floor(
  Math.min(window.innerHeight, window.innerWidth) * (2 / 3)
);

const CanvasWidth = CanvasHeight * (4 / 3);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [date, setDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0);
    return date;
  });

  const day = date.getUTCDate();
  const month = AllMonths[date.getUTCMonth()];
  const weekday = AllWeekdays[date.getUTCDay()];

  const [solutionFinder, setSolutionFinder] = useState<SolutionFinder>(
    () => new SolutionFinder(createBlockers({ day, month, weekday }))
  );
  const [solutionIndex, setSolutionIndex] = useState(0);

  /**
   * @param deltaTime Time since the last frame in ms
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onLoop = useCallback((_deltaTime: number) => {
    // Do something here
  }, []);

  /**
   * @param deltaTime Time since the last frame in ms
   */
  const draw = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_deltaTime: number) => {
      if (canvasRef.current === null) return;
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
      ctx.save();

      drawBoard(ctx, solutionFinder.getSolutions()[solutionIndex]);
      // drawBoard(ctx, createBlockers({ day: 1, month: "Jan", weekday: "Mon" }));

      ctx.restore();
    },
    [solutionFinder, solutionIndex]
  );

  useEffect(() => {
    let active = true;
    let lastTime = 0;
    function loop(time: number) {
      const deltaTime = Math.max(50 / 3, time - lastTime);
      if (active) {
        onLoop(deltaTime);
        draw(deltaTime);
        lastTime = time;
        window.requestAnimationFrame(loop);
      }
    }
    loop(0);
    return () => {
      active = false;
    };
  }, [onLoop, draw]);

  useEffect(() => {
    const grid = createBlockers({
      month,
      day,
      weekday,
    });

    setSolutionFinder(new SolutionFinder(grid));
    setSolutionIndex(0);
  }, [month, day, weekday]);

  return (
    <div className="flex flex-row justify-evenly w-screen">
      <div className="flex flex-col">
        <canvas
          ref={canvasRef}
          className="bg-white"
          width={CanvasWidth}
          height={CanvasHeight}
        ></canvas>
      </div>
      <div className="flex flex-col gap-3">
        <h1>Calendar Polyomino Solver</h1>
        <input
          className=""
          type="date"
          value={`${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
            .getUTCDate()
            .toString()
            .padStart(2, "0")}`}
          onChange={(event) => {
            let date = new Date(event.target.value);
            if (Number.isNaN(date.getDate())) {
              date = new Date();
              date.setHours(0);
            }
            setDate(date);
          }}
        />
        <div className="w-full flex flex-col gap-2">
          <h2>Solutions</h2>
          <span>Total Count: {solutionFinder.getSolutions().length}</span>
          <div className="w-full flex">
            <input
              className="grow"
              type="range"
              min={0}
              max={solutionFinder.getSolutions().length - 1}
              step={1}
              value={solutionIndex}
              onChange={(event) => {
                setSolutionIndex(event.target.valueAsNumber);
              }}
            />
          </div>
          <span>Currently viewing solution: #{solutionIndex + 1}</span>
        </div>
      </div>
    </div>
  );
}
