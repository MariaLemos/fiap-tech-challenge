import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ActivePieShape } from "./ActivePieShape";
import {
  PIE_CHART_COLORS,
  PIE_CHART_MARGIN,
  PIE_INNER_RADIUS,
  PIE_OUTER_RADIUS,
} from "./PieChart.constants";
import type { PieChartComponentProps } from "./PieChart.types";

export default function PieChartComponent({
  data,
  isAnimationActive = true,
  defaultIndex = undefined,
}: PieChartComponentProps) {
  return (
    <div className="h-[320px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={PIE_CHART_MARGIN}>
          <Pie
            activeShape={ActivePieShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={PIE_INNER_RADIUS}
            outerRadius={PIE_OUTER_RADIUS}
            dataKey="value"
            nameKey="name"
            isAnimationActive={isAnimationActive}
          >
            {data.map((item, index) => (
              <Cell
                key={item.name}
                fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip defaultIndex={defaultIndex} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
