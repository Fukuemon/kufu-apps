import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button.js";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">xs</Button>
      <Button size="sm">sm</Button>
      <Button size="default">default</Button>
      <Button size="lg">lg</Button>
      <Button size="icon-xs" aria-label="icon-xs">
        ×
      </Button>
      <Button size="icon-sm" aria-label="icon-sm">
        ×
      </Button>
      <Button size="icon" aria-label="icon">
        ×
      </Button>
      <Button size="icon-lg" aria-label="icon-lg">
        ×
      </Button>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: "図面が固まっていない段階の加工・部品調達の相談をする",
  },
};
