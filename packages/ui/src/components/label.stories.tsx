import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input.js";
import { Label } from "./label.js";

const meta = {
  title: "UI/Label",
  component: Label,
  args: {
    children: "会社名",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="label-story-input">会社名</Label>
      <Input id="label-story-input" placeholder="株式会社サンプル" />
    </div>
  ),
};

export const LongText: Story = {
  args: {
    children:
      "ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)",
  },
};
