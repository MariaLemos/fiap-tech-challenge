import type { Meta, StoryObj } from "@storybook/react";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { Header } from "./Header";

const meta = {
  title: "Organisms/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    userName: "Maria Lemos",
    logoutHref: "/auth/logout",
    logoutLabel: "Sair",
  },
  decorators: [
    (Story) => (
      <PathnameContext.Provider value="/">
        <Story />
      </PathnameContext.Provider>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
