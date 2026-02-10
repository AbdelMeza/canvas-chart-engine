import { useRef, useState } from "react"

function App() {
  const graphContainer = useRef<HTMLCanvasElement | null>(null)
  const xData = useRef<HTMLDivElement | null>(null)
  const yData = useRef<HTMLDivElement | null>(null)

  const [activeGraph, setActiveGraph] = useState<"line" | "bar">("line")

  return (
    <main>
      <div className="switch-buttons">
        <button
          className={`line ${activeGraph === "line" ? "active" : ""}`}
          onClick={() => setActiveGraph("line")}
        >
          Line
        </button>

        <button
          className={`bar ${activeGraph === "bar" ? "active" : ""}`}
          onClick={() => setActiveGraph("bar")}
        >
          Bar
        </button>
      </div>

      <div className="graph-wrapper">
        <div className="y-data" ref={yData}></div>
        <canvas className="graph-container" ref={graphContainer}></canvas>
        <div className="x-data" ref={xData}></div>
      </div>
    </main>
  )
}

export default App
