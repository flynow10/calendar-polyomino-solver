import { useCallback, useEffect, useRef, useState } from "react";
import { createBlockers, Month, Weekday } from "./puzzle";
import { drawBoard } from "./draw";
import { SolutionFinder } from "./algorithm-x";

const CanvasWidth = Math.floor(
  Math.min(window.innerHeight, window.innerWidth) * (2 / 3)
);
const CanvasHeight = CanvasWidth;

const months: Month[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekdays: Weekday[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const [month, setMonth] = useState<Month>("Jan");
  // const [weekday, setWeekday] = useState<Weekday>("Mon");
  // const [day, setDay] = useState(1);
  const [date, setDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0);
    return date;
  });

  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const weekday = weekdays[date.getUTCDay()];

  const [solutionFinder, setSolutionFinder] = useState<SolutionFinder>(
    () => new SolutionFinder(createBlockers({ day, month, weekday }))
  );
  const [solutionIndex, setSolutionIndex] = useState(0);

  /**
   * @param deltaTime Time since the last frame in ms
   */
  const onLoop = useCallback((deltaTime: number) => {
    // Do something here
  }, []);

  /**
   * @param deltaTime Time since the last frame in ms
   */
  const draw = useCallback(
    (deltaTime: number) => {
      if (canvasRef.current === null) return;
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.clearRect(0, 0, CanvasWidth, CanvasHeight);
      ctx.save();

      drawBoard(ctx, solutionFinder.solutions[solutionIndex]);

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
      <div className="flex flex-col gap-3">
        <canvas
          ref={canvasRef}
          className="bg-white"
          width={CanvasWidth}
          height={CanvasHeight}
        ></canvas>
        <div className="w-full flex gap-2">
          <input
            className="grow"
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
        </div>
        <div className="w-full flex gap-2">
          <input
            className="grow"
            type="range"
            min={0}
            max={solutionFinder.solutions.length - 1}
            step={1}
            value={solutionIndex}
            onChange={(event) => {
              setSolutionIndex(event.target.valueAsNumber);
            }}
          />
          <span>{solutionIndex}</span>
        </div>
      </div>
    </div>
  );
}
