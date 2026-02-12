import { useEffect, useRef, useState } from "react"
import { data } from "../Data/data"

function App() {
  const graphContainer = useRef<HTMLCanvasElement | null>(null)
  const xData = useRef<HTMLDivElement | null>(null)
  const yData = useRef<HTMLDivElement | null>(null)

  const [activeGraph, setActiveGraph] = useState<"line" | "bar">("line")
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const max: number = Math.max(...data)

  useEffect(() => {
    renderYData()
    renderXData()
  }, [canvasSize])

  useEffect(() => {
    if (!graphContainer.current) return

    const resize = () => {
      setCanvasSize({
        width: graphContainer.current!.clientWidth,
        height: graphContainer.current!.clientHeight,
      })
    }

    resize()
    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }, [])

  function renderYData(steps = 5) {
    if (!yData.current) return

    yData.current.innerHTML = ""
    yData.current.style.height = `${canvasSize.height}px`

    for (let i = steps; i >= 0; i--) {
      const value = Math.round((max / steps) * i)
      const label = document.createElement("div")
      label.textContent = String(value)
      yData.current!.appendChild(label)
    }
  }

  function renderXData() {
    if (!xData.current) return

    xData.current.innerHTML = ""
    xData.current.style.width = `${canvasSize.width}px`

    data.forEach((_, i) => {
      const label = document.createElement("div")
      label.textContent = String(i + 1)
      xData.current!.appendChild(label)
    })
  }

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
        <div className="chart">
          <div className="y-data" ref={yData}></div>
          <canvas className="graph-container" ref={graphContainer}></canvas>
          <div className="x-data" ref={xData}></div>
        </div>
      </div>
    </main>
  )
}

export default App
