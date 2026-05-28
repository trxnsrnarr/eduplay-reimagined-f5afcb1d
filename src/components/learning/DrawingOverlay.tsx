import { useEffect, useRef, useState, useCallback } from "react";
import { Pencil, Highlighter, Eraser, Trash2, X, PenLine } from "lucide-react";

type Tool = "pen" | "highlight" | "eraser";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#0f172a"];

type Stroke = {
  tool: Tool;
  color: string;
  size: number;
  points: { x: number; y: number }[];
};

/**
 * Floating drawing/highlight overlay. Sits absolutely on top of its parent
 * (which must be `relative`). Toggle via the floating FAB.
 */
export function DrawingOverlay({ resetKey }: { resetKey?: string | number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef<Stroke | null>(null);

  const [active, setActive] = useState(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);

  // reset strokes when slide changes
  useEffect(() => {
    strokesRef.current = [];
    drawingRef.current = null;
    redraw();
  }, [resetKey]);

  const redraw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const all = [...strokesRef.current];
    if (drawingRef.current) all.push(drawingRef.current);
    for (const s of all) {
      if (s.points.length < 1) continue;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (s.tool === "highlight") {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalCompositeOperation = "source-over";
      } else if (s.tool === "eraser") {
        ctx.globalAlpha = 1;
        ctx.lineWidth = s.size;
        ctx.globalCompositeOperation = "destination-out";
      } else {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }, []);

  // size canvas to wrapper
  useEffect(() => {
    if (!active) return;
    const wrap = wrapRef.current;
    const c = canvasRef.current;
    if (!wrap || !c) return;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      c.style.width = `${r.width}px`;
      c.style.height = `${r.height}px`;
      const ctx = c.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [active, redraw]);

  const pos = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent) => {
    if (!active) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const size = tool === "highlight" ? 18 : tool === "eraser" ? 22 : 3;
    drawingRef.current = { tool, color, size, points: [pos(e)] };
    redraw();
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawingRef.current) return;
    drawingRef.current.points.push(pos(e));
    redraw();
  };
  const onUp = () => {
    if (!drawingRef.current) return;
    strokesRef.current.push(drawingRef.current);
    drawingRef.current = null;
    redraw();
  };

  const clearAll = () => {
    strokesRef.current = [];
    drawingRef.current = null;
    redraw();
  };

  return (
    <>
      {/* Overlay canvas */}
      <div
        ref={wrapRef}
        className={`absolute inset-0 z-30 ${active ? "" : "pointer-events-none"}`}
        style={{ touchAction: active ? "none" : "auto" }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={active ? "cursor-crosshair" : ""}
        />
      </div>

      {/* Toolbar */}
      <div className="absolute right-3 top-3 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setActive((v) => !v)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-extrabold shadow-card transition-all ${
            active ? "bg-foreground text-background" : "bg-white text-foreground border-2 border-border hover:border-primary"
          }`}
        >
          {active ? <><X className="w-3.5 h-3.5" /> Tutup</> : <><PenLine className="w-3.5 h-3.5" /> Coret-coret</>}
        </button>

        {active && (
          <div className="bg-white/95 backdrop-blur border-2 border-border rounded-2xl p-2 shadow-card flex flex-col gap-2">
            <div className="flex gap-1">
              {[
                { t: "pen" as Tool, Icon: Pencil, label: "Pen" },
                { t: "highlight" as Tool, Icon: Highlighter, label: "Stabilo" },
                { t: "eraser" as Tool, Icon: Eraser, label: "Hapus" },
              ].map(({ t, Icon, label }) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  title={label}
                  className={`w-9 h-9 grid place-items-center rounded-xl transition-all ${
                    tool === t ? "bg-gradient-brand text-white" : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    color === c ? "border-foreground scale-110" : "border-white"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <button
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan
            </button>
          </div>
        )}
      </div>
    </>
  );
}
