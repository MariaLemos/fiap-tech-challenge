"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

export type BarChartItem = {
  name: string;
  uv: number;
  pv: number;
  amt?: number;
};

type SimpleBarChartProps = {
  data?: BarChartItem[];
  maxWidthClassName?: string;
};

const sampleData: BarChartItem[] = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const SimpleBarChart = ({
  data = sampleData,
  maxWidthClassName = "max-w-[700px]",
}: SimpleBarChartProps) => {
  return (
    <RechartsBarChart
      className={`aspect-[1.618] max-h-[70vh] w-full ${maxWidthClassName}`}
      responsive
      data={data}
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="pv"
        fill="#8884d8"
        activeBar={{ fill: "pink", stroke: "blue" }}
        radius={[10, 10, 0, 0]}
      />
      <Bar
        dataKey="uv"
        fill="#82ca9d"
        activeBar={{ fill: "gold", stroke: "purple" }}
        radius={[10, 10, 0, 0]}
      />
      <RechartsDevtools />
    </RechartsBarChart>
  );
};

export default SimpleBarChart;
