import { FrameBuffer } from "./utils/FrameBuffer";

type Props = {
  frameBuffer: FrameBuffer;
};

export default function PixelGrid({ frameBuffer }: Props) {
  if (!frameBuffer || frameBuffer.isEmpty()) {
    return <div>No data available</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${frameBuffer.buffer[0].length}, 60px)`,
        gridTemplateRows: `repeat(${frameBuffer.buffer.length}, 60px)`,
        gap: "0.2rem",
      }}
    >
      {frameBuffer.buffer.flat().map((color, i) => (
        <div
          key={i}
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
