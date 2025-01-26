type Props = {
  frameBuffer: string[][];
};

export default function PixelGrid({ frameBuffer }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${frameBuffer[0].length}, 10px)`,
        gridTemplateRows: `repeat(${frameBuffer.length}, 10px)`,
        gap: "1px",
      }}
    >
      {frameBuffer.flat().map((color, i) => (
        <div
          key={i}
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
