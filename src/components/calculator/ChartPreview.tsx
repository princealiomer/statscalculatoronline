"use client";

import { useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { parseNumbers, parsePaired } from "@/lib/stats/parse";
import { frequencyTable, mean, stdev } from "@/lib/stats/descriptive";
import type { CalcResult } from "@/lib/stats/format";
import jStat from "jstat";

export function ChartPreview({
  engine,
  values,
  result,
}: {
  engine: string;
  values: Record<string, string>;
  result: CalcResult | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  if (!result || result.error) return null;

  async function downloadPng() {
    const root = wrapRef.current;
    const svg = root?.querySelector("svg");
    if (!svg) {
      setStatus("No chart to download yet.");
      return;
    }
    try {
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svg);
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      const box = svg.getBoundingClientRect();
      const width = Math.max(640, Math.ceil(box.width) || 640);
      const height = Math.max(320, Math.ceil(box.height) || 320);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Could not render chart image."));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const png = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = png;
      a.download = `${engine}-chart.png`;
      a.click();
      setStatus("PNG downloaded");
      window.setTimeout(() => setStatus(null), 2000);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Download failed");
    }
  }

  function downloadSvg() {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) {
      setStatus("No chart to download yet.");
      return;
    }
    const source = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${engine}-chart.svg`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus("SVG downloaded");
    window.setTimeout(() => setStatus(null), 2000);
  }

  let chart: React.ReactNode = null;
  let title = "Chart";

  if (engine === "chart-bell") {
    const mu = Number(values.mean ?? 0);
    const sd = Number(values.sd ?? 1) || 1;
    const data = Array.from({ length: 61 }, (_, i) => {
      const x = mu - 3 * sd + (6 * sd * i) / 60;
      return { x: Number(x.toFixed(3)), y: jStat.normal.pdf(x, mu, sd) };
    });
    title = "Bell curve";
    chart = (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#134e4a22" />
          <XAxis dataKey="x" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#0f766e" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  } else if (engine === "chart-scatter" || engine === "chart-ba") {
    const { x, y } = parsePaired(values.data ?? "");
    const data = x.map((xi, i) => ({ x: xi, y: y[i] }));
    title = "Scatter";
    chart = (
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#134e4a22" />
          <XAxis dataKey="x" tick={{ fontSize: 11 }} name="x" />
          <YAxis dataKey="y" tick={{ fontSize: 11 }} name="y" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#0f766e" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  } else {
    const nums = parseNumbers(values.data ?? "");
    if (nums.length < 1) return null;

    if (engine === "chart-hist" || engine === "chart-density" || engine === "chart-dot") {
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const bins = 10;
      const width = (max - min) / bins || 1;
      const hist = Array.from({ length: bins }, (_, i) => {
        const lo = min + i * width;
        const hi = lo + width;
        const count = nums.filter((v) => v >= lo && (i === bins - 1 ? v <= hi : v < hi)).length;
        return { bin: lo.toFixed(1), count };
      });
      title = "Histogram";
      chart = (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={hist}>
            <CartesianGrid strokeDasharray="3 3" stroke="#134e4a22" />
            <XAxis dataKey="bin" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      const freq = frequencyTable(nums).map((r) => ({
        name: String(r.value),
        count: r.count,
      }));
      title = "Frequency chart";
      chart = (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={freq.slice(0, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#134e4a22" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-teal-900/60">
            n={nums.length}, mean={mean(nums).toFixed(3)}, sd={stdev(nums).toFixed(3)}
          </p>
        </>
      );
    }
  }

  return (
    <div className="rounded-2xl border border-teal-900/10 bg-white/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg text-teal-950">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={downloadPng}
            className="rounded-full border border-teal-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-teal-950 hover:bg-teal-50"
          >
            Download PNG
          </button>
          <button
            type="button"
            onClick={downloadSvg}
            className="rounded-full border border-teal-900/15 bg-white px-3 py-1.5 text-xs font-semibold text-teal-950 hover:bg-teal-50"
          >
            Download SVG
          </button>
        </div>
      </div>
      <div className="mt-3" ref={wrapRef}>
        {chart}
      </div>
      {status && <p className="mt-2 text-xs font-medium text-teal-800">{status}</p>}
    </div>
  );
}
