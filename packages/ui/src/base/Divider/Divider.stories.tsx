import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider.js";

const meta = {
  title: "コンポーネント/Base/Divider",
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-md gap-4">
      <p className="text-body text-text-secondary">
        Content above the separator.
      </p>
      <Divider />
      <p className="text-body text-text-secondary">
        Content below the separator.
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-12 items-center gap-4 text-body text-text-secondary">
      <span>First</span>
      <Divider orientation="vertical" />
      <span>Second</span>
    </div>
  ),
};
