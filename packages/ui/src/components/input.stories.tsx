import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

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

// Tab キーでフォーカスした状態。focus-ring の表示を、VRT で見る。
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
  },
};

// エラーの欄でも、黄の影が aria-invalid の ring に上書きされないことを、VRT で見る。
export const InvalidFocused: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value",
  },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
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
