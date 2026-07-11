import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@repo/i18n";
import { useI18n } from "@repo/i18n/react";
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
  const { locale } = useI18n();
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
          <Tooltip
            defaultIndex={defaultIndex}
            formatter={(value) => formatCurrency(Number(value), locale)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
