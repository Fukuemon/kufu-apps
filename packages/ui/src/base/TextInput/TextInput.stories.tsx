import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { TextInput } from "./TextInput.js";
import { expectTargetSize } from "../../test/target-size.js";

const meta = {
  title: "コンポーネント/Base/TextInput",
  component: TextInput,
  args: {
    placeholder: "会社名を入力",
  },
} satisfies Meta<typeof TextInput>;

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

// エラーの欄でも、フォーカスの黒の線と黄の影が出ることを確かめる。
// 表示は欄の外へ広がり、内容の大きさで切る story の画像には写らないので、VRT ではなく計算したスタイルで見る。
export const InvalidFocused: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "invalid@value",
  },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const input = within(canvasElement).getByRole("textbox");
    await expect(input).toHaveFocus();
    // transition-colors が線の色を変える遷移の、終わりの色を見る
    await Promise.all(input.getAnimations().map((a) => a.finished));
    const line = resolveColor("--kufu-color-focus-outline"); // design-system-allow: focus-ring が出した色と比べる
    const halo = resolveColor("--kufu-color-focus-halo"); // design-system-allow: focus-ring が出した色と比べる
    const style = getComputedStyle(input);
    await expect(style.outlineStyle).toBe("solid");
    await expect(style.outlineWidth).toBe("4px");
    await expect(style.outlineColor).toBe(line);
    await expect(style.boxShadow).toContain(halo);
  },
};

// セマンティックトークンの色を、getComputedStyle が返す rgb() の形にする
function resolveColor(token: string) {
  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

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

// マウスを乗せた状態。storybook-addon-pseudo-states で :hover の見た目を出す。
export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};
