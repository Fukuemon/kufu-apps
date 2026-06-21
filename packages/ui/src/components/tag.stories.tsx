import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./tag.js";

const meta = {
  title: "Primitives/Tag",
  component: Tag,
  args: {
    children: "Tag",
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Default</Tag>
      <Tag variant="secondary">Secondary</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
};
