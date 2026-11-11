import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { expectTargetSize } from "../../test/target-size.js";
import { Textarea } from "./Textarea.js";

const meta = {
  title: "コンポーネント/Base/Textarea",
  component: Textarea,
  args: {
    placeholder: "相談内容を入力",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectTargetSize(within(canvasElement).getByRole("textbox"));
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "バリデーションエラー時の表示",
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
      "複数行の長文が入力されたときの field-sizing による高さ追従を確認する。\n加工方法や治具の検討で得た知見を共有し、量産を見据えた形状・工程へ調整する。\n材料選定の相談、加工工程の検討、納期と品質の調整、検査観点の整理までを一気通貫で扱う。",
  },
};

// マウスを乗せた状態。storybook-addon-pseudo-states で :hover の見た目を出す。
export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

// Tab キーでフォーカスした状態。focus-ring の表示を、VRT で見る。
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("textbox")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};
