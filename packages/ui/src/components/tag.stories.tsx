import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./tag.js";

const meta = {
  title: "Primitives/Tag",
  component: Tag,
  args: {
    children: "製品カテゴリ",
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>製品カテゴリ</Tag>
      <Tag variant="secondary">メーカー</Tag>
      <Tag variant="outline">加工・組立</Tag>
    </div>
  ),
};

export const Compact: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">必須</Tag>
      <Tag size="sm" variant="secondary">
        任意
      </Tag>
    </div>
  ),
};
