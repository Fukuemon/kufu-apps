import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator.js";

const meta = {
  title: "UI/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <p className="text-sm text-muted-foreground">
        Content above the separator.
      </p>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Content below the separator.
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4 text-sm text-muted-foreground">
      <span>First</span>
      <Separator orientation="vertical" />
      <span>Second</span>
    </div>
  ),
};
