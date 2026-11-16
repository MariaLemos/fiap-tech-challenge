"use client";

import { SectionBox } from "@repo/design-system";
import { PieChartComponent } from "@repo/design-system/charts";

type AllocationSectionProps = {
  title: string;
  allocation: Record<string, number>;
};

export function AllocationSection({
  title,
  allocation,
}: AllocationSectionProps) {
  return (
    <SectionBox title={title}>
      <PieChartComponent
        data={Object.entries(allocation).map(([name, value]) => ({
          name,
          value,
        }))}
      />
    </SectionBox>
  );
}
