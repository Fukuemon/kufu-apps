import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge.js";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Default</Badge>
      <Badge size="sm" tone="required">
        Required
      </Badge>
      <Badge size="sm" tone="optional">
        Optional
      </Badge>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: "長いラベルが折り返されずに収まるかを確認するためのバッジ表記",
  },
};
