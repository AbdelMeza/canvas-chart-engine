import { useEffect, useRef, useState } from "react"
import { data } from "../Data/data"

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const xData = useRef<HTMLDivElement | null>(null)
  const yData = useRef<HTMLDivElement | null>(null)

  const [activeGraph, setActiveGraph] = useState<"line" | "bar">("line")
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const padding = 40
  const max = Math.max(...data)

  const stepX =
    activeGraph === "bar"
      ? (canvasSize.width - padding * 2) / data.length
      : (canvasSize.width - padding * 2) / (data.length - 1)

  const getX = (i: number) => padding + i * stepX + (activeGraph === "bar" ? stepX / 2 : 0)

  const getY = (value: number) => canvasSize.height - padding - (value / max) * (canvasSize.height - padding * 2)

  /* ---------------- RESIZE ---------------- */

  useEffect(() => {
    if (!canvasRef.current) return

    const resize = () => {
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width
      canvas.height = rect.height

      setCanvasSize({
        width: rect.width,
        height: rect.height
      })

      ctxRef.current = canvas.getContext("2d")
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  /* ---------------- AXES ---------------- */

  useEffect(() => {
    renderYData()
    renderXData()
  }, [canvasSize, activeGraph])

  function renderYData(steps = 5) {
    if (!yData.current) return

    yData.current.innerHTML = ""
    yData.current.style.height = `${canvasSize.height}px`
    yData.current.style.padding = `${padding}px 0`

    for (let i = steps; i >= 0; i--) {
      const value = Math.round((max / steps) * i)
      const label = document.createElement("div")
      label.textContent = String(value)
      yData.current.appendChild(label)
    }
  }

  function renderXData() {
    if (!xData.current) return

    xData.current.innerHTML = ""
    xData.current.style.width = `${canvasSize.width}px`
    xData.current.style.padding = `0 ${padding}px`

    data.forEach((_, i) => {
      const label = document.createElement("div")
      label.textContent = String(i + 1)
      label.style.width = `${stepX}px`
      label.style.textAlign = "center"
      xData.current!.appendChild(label)
    })
  }

  /* ---------------- DRAW ---------------- */

  useEffect(() => {
    if (!ctxRef.current) return
    clear()

    activeGraph === "line" ? drawLineChart() : drawBarChart()
  }, [canvasSize, activeGraph])

  function clear() {
    ctxRef.current!.clearRect(0, 0, canvasSize.width, canvasSize.height)
  }

  function drawLineChart() {
    const ctx = ctxRef.current!
    ctx.beginPath()

    data.forEach((value, i) => {
      const x = getX(i)
      const y = getY(value)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })

    ctx.strokeStyle = "#22c55e"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  function drawBarChart() {
    const ctx = ctxRef.current!
    const barWidth = stepX * 0.6

    data.forEach((value, i) => {
      const x = getX(i) - barWidth / 2
      const y = getY(value)
      const height = canvasSize.height - padding - y

      ctx.fillStyle = "#22c55e"
      ctx.fillRect(x, y, barWidth, height)
    })
  }

  /* ---------------- UI ---------------- */

  return (
    <main>
      <div className="switch-buttons">
        <button
          className={activeGraph === "line" ? "active" : ""}
          onClick={() => setActiveGraph("line")}
        >
          Line
        </button>

        <button
          className={activeGraph === "bar" ? "active" : ""}
          onClick={() => setActiveGraph("bar")}
        >
          Bar
        </button>
      </div>

      <div className="graph-wrapper">
        <div className="chart">
          <div className="y-data" ref={yData}></div>
          <canvas ref={canvasRef} className="graph-container" />
          <div className="x-data" ref={xData}></div>
        </div>
      </div>
    </main>
  )
}

export default App
