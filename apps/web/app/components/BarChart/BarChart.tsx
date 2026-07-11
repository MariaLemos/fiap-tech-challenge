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
import { staticColors } from "@repo/design-system";

export type BarChartItem = {
  [key: string]: number | string;
};

type SimpleBarChartProps = {
  data: BarChartItem;
  maxWidthClassName?: string;
};

const SimpleBarChart = ({
  data,
  maxWidthClassName = "max-w-[700px]",
}: SimpleBarChartProps) => {
  const bars = data ? Object.keys(data).filter((key) => key !== "name") : [];
  return (
    <RechartsBarChart
      className={`aspect-[1.618] max-h-[70vh] w-full ${maxWidthClassName}`}
      responsive
      data={[data]}
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="expenses"
        fill={staticColors.red[500]}
        radius={[10, 10, 0, 0]}
      />
      <Bar
        dataKey="receipts"
        fill={staticColors.green[500]}
        radius={[10, 10, 0, 0]}
      />

      <RechartsDevtools />
    </RechartsBarChart>
  );
};

export default SimpleBarChart;
