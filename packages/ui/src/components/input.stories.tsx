import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input.js";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "会社名を入力",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "編集不可の値",
  },
};

export const LongValue: Story = {
  args: {
    defaultValue:
      "入力値が入力欄の幅を超えたときのスクロールと省略の挙動を確認するための長い文字列を入れている",
  },
};
