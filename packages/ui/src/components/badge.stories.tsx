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

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Default</Badge>
      <Badge size="sm" variant="secondary">
        Secondary
      </Badge>
      <Badge size="sm" variant="destructive">
        Destructive
      </Badge>
      <Badge size="sm" variant="outline">
        Outline
      </Badge>
      <Badge size="sm" variant="ghost">
        Ghost
      </Badge>
      <Badge size="sm" variant="link">
        Link
      </Badge>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: "長いラベルが折り返されずに収まるかを確認するためのバッジ表記",
  },
};
