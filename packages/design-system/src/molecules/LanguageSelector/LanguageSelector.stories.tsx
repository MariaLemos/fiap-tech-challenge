import type { Meta, StoryObj } from "@storybook/react";
import { LanguageSelector } from "./LanguageSelector";

const meta = {
  title: "Molecules/LanguageSelector",
  component: LanguageSelector,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portuguese: Story = {};
