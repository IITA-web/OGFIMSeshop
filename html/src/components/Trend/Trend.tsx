import { ApexOptions } from "apexcharts";
import { useMemo } from "react";
import Chart from "react-apexcharts";

const Trend: React.FC<any> = ({ chartData }) => {
  const config = useMemo<{
    series: any[];
    options: ApexOptions;
  }>(
    () => ({
      series: [
        {
          name: "Views",
          data: chartData.map((item) => item.views),
        },
      ],
      options: {
        stroke: {
          curve: "smooth",
          colors: ["#67A961"],
        },
        chart: {
          id: "stat",
          height: 350,
          type: "area",
          zoom: {
            enabled: false,
          },
          toolbar: {
            tools: {
              download: false,
            },
          },
        },
        colors: ["#67A961"],
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "datetime",
          categories: chartData.map((item) => item.date),
        },
        tooltip: {
          x: {
            format: "MMM dd, yyyy",
          },
        },
        fill: {
          colors: ["#67A961"],
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
    }),
    [chartData]
  );

  return (
    <Chart
      options={config.options}
      series={config.series}
      type="area"
      height={350}
    />
  );
};

export default Trend;
