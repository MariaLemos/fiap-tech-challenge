import type { TooltipIndex } from "recharts";

export type PieChartItem = {
  name: string;
  value: number;
};

export type PieChartComponentProps = {
  data: PieChartItem[];
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
};