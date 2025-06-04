import { useEffect, useRef, useState } from "react";
import { UndoIcon } from "../icons/UndoIcon";
import { RedoIcon } from "../icons/RedoIcon";
import { DeleteIcon } from "../icons/DeleteIcon";

const DigitRecognizerCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 15;
    setContext(ctx);
  }, []);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!context) return;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (!context) return;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="w-full my-10">
      <p className="font-mono my-2">
        Draw a digit (0-9) below and click Predict.
      </p>
      <div className="w-full h-[500px] border-2 border-gray-300 rounded-md shadow-md relative bg-black rounded-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </div>
      <div className="mt-4">
        <button className="btn btn-sm btn-outline rounded-none mr-2">
          <UndoIcon />
        </button>
        <button className="btn btn-sm btn-outline rounded-none mr-4">
          <RedoIcon />
        </button>
        <button className="btn btn-sm btn-outline rounded-none btn-error mr-4">
          <DeleteIcon />
        </button>
        <button className="btn btn-sm rounded-none float-end text-black bg-white font-mono hover:bg-gray-300">
          Predict
        </button>
      </div>
    </div>
  );
};
export { DigitRecognizerCanvas };
