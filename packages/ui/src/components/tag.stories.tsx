import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./tag.js";

const meta = {
  title: "UI/Tag",
  component: Tag,
  args: {
    children: "製品カテゴリ",
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">既定</Tag>
      <Tag size="sm" tone="required">
        必須
      </Tag>
      <Tag size="sm" tone="optional">
        任意
      </Tag>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: "長いタグ表記が崩れないかを確認するためのカテゴリ名の例",
  },
};
