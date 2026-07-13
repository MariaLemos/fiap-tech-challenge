import type { Meta, StoryObj } from "@storybook/react";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { Navigation } from "./Navigation";

const meta = {
  title: "Molecules/Navigation",
  component: Navigation,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <PathnameContext.Provider value="/">
        <Story />
      </PathnameContext.Provider>
    ),
  ],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <strong className="mr-4 text-primary">FIAP Finance</strong>,
  },
};
