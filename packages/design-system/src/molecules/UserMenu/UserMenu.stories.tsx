import type { Meta, StoryObj } from "@storybook/react";
import { UserMenu } from "./UserMenu";

const meta = {
  title: "Molecules/UserMenu",
  component: UserMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    userName: "Maria Lemos",
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLogout: Story = {
  args: {
    logoutHref: "/auth/logout",
    logoutLabel: "Sair",
    className: "bg-primary py-3 text-white",
  },
};
