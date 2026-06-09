import React, { useEffect, useState } from "react";

let chartLoader;

function loadLineChart() {
  if (!chartLoader) {
    chartLoader = Promise.all([import("react-chartjs-2"), import("chart.js")]).then(
      ([reactChart, chartModule]) => {
        const {
          CategoryScale,
          Chart: ChartJS,
          Filler,
          Legend,
          LineElement,
          LinearScale,
          PointElement,
          Tooltip,
        } = chartModule;

        ChartJS.register(CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);

        return reactChart.Line;
      },
    );
  }

  return chartLoader;
}

export default function LazyLineChart({ data, options }) {
  const [LineChart, setLineChart] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;

    let isMounted = true;

    loadLineChart().then((Component) => {
      if (isMounted) {
        setLineChart(() => Component);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [shouldLoad]);

  if (!LineChart) {
    return (
      <div
        ref={containerRef}
        className="flex h-full min-h-[260px] items-center justify-center rounded-2xl bg-slate-50 text-sm font-semibold text-slate-500 dark:bg-slate-900/60 dark:text-slate-400"
      >
        {shouldLoad ? "Loading chart" : "Chart loads when visible"}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full">
      <LineChart data={data} options={options} />
    </div>
  );
}
