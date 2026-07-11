"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  YAxis,
} from "recharts";
import { staticColors } from "../../atoms/tokens/colors";

export type BarChartItem = {
  [key: string]: number | string;
};

export type SimpleBarChartProps = {
  data: BarChartItem;
  labels?: Record<string, string>;
  maxWidthClassName?: string;
};

export const SimpleBarChart = ({
  data,
  labels = {},
  maxWidthClassName = "max-w-[700px]",
}: SimpleBarChartProps) => {
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
        name={labels.expenses}
        fill={staticColors.red[500]}
        radius={[10, 10, 0, 0]}
      />
      <Bar
        dataKey="receipts"
        name={labels.receipts}
        fill={staticColors.green[500]}
        radius={[10, 10, 0, 0]}
      />
    </RechartsBarChart>
  );
};
