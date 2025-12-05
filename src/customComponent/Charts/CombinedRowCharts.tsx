import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function CombinedRowCharts({
  consumptionData,
  expectedVsActualData,
}) {
  const months = expectedVsActualData.map((d) => d.month);
const projects = consumptionData.map((d) => d.project);
  /* ---------------- LINE CHART — Expected vs Actual ---------------- */
  const expected = expectedVsActualData.map((d) => d.expected);
  const actual = expectedVsActualData.map((d) => d.actual);

  const lineSeries = [
    { name: "Expected", data: expected },
    { name: "Actual", data: actual },
  ];

  const lineOptions: ApexOptions = {
    colors: ["#6366f1", "#f97316"],
    chart: {
      type: "line",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      // gradient: {
      //   opacityFrom: 0.8,
      //   opacityTo: 0.5,
      // },
    },
    xaxis: {
      categories: months,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontSize: "12px" } },
    },
    legend: {
      position: "top",
      fontSize: "14px",
    },
    // tooltip: { shared: true },
  };

  /* ---------------- BAR CHART — Consumption Data ---------------- */
  const cement = consumptionData.map((d) => d.cement);
  const steel = consumptionData.map((d) => d.steel);
  const bitumen = consumptionData.map((d) => d.bitumen);
  const aggregate = consumptionData.map((d) => d.aggregate);

  const barSeries = [
    { name: "Cement", data: cement },
    { name: "Steel", data: steel },
    { name: "Bitumen", data: bitumen },
    { name: "Aggregate", data: aggregate },
  ];

  const barOptions: ApexOptions = {
    colors: ["#f97316", "#334155", "#fbbf24", "#94a3b8"],
    chart: {
      type: "bar",
      height: 300,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
                  // columnWidth: '55%',
                  borderRadius: 5,
                  borderRadiusApplication: 'end'
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
                width: 3,
                colors: ['transparent']
    },
    xaxis: {
      categories: projects,
      axisBorder: { show: true },
      axisTicks: { show: true },
    },

    //   grid: {
    //   padding: { left: 10, right: 10 },
    // },
    yaxis: { labels: { style: { fontSize: "12px" } } ,
   axisBorder: { show: true },
      axisTicks: { show: true },},
    // legend: { position: "top", fontSize: "14px" },
    legend: {
      position: "top",
      fontSize: "14px",
      markers: {
        width: 10,
        height: 10,
        strokeWidth: 0,
        radius: 12, // makes dot circular
        shape: "circle",
      },
      itemMargin: {
        horizontal: 12,
        vertical: 4,
      },
    },
    // tooltip: { shared: true },
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* ---------- LEFT: Expected vs Actual Line Chart ---------- */}
      <div className="col-span-12 xl:col-span-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Expected vs Actual
          </h3>
          <p className="mb-4 text-theme-sm text-gray-500 dark:text-gray-400">
            Monthly progress comparison
          </p>

          <Chart
            options={lineOptions}
            series={lineSeries}
            type="line"
            height={300}
          />
        </div>
      </div>

      {/* ---------- RIGHT: Consumption Bar Chart ---------- */}
      <div className="col-span-12 xl:col-span-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
            Consumption Data
          </h3>
          <p className="mb-4 text-theme-sm text-gray-500 dark:text-gray-400">
            Cement / Steel / Bitumen / Aggregate
          </p>

          <Chart
            options={barOptions}
            series={barSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
