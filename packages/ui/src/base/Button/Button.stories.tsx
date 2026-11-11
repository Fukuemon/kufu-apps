import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Button } from "./Button.js";
import { expectTargetSize } from "../../test/target-size.js";

const meta = {
  title: "コンポーネント/Base/Button",
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectTargetSize(within(canvasElement).getByRole("button"));
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const LongLabel: Story = {
  args: {
    children: "図面が固まっていない段階の加工・部品調達の相談をする",
  },
};

export const Cta: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="cta" size="cta-sm">
        cta-sm
      </Button>
      <Button variant="cta" size="cta-md">
        cta-md
      </Button>
      <Button variant="cta" size="cta-lg">
        cta-lg
      </Button>
      <Button variant="cta" size="cta-hero">
        cta-hero
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole("button")) {
      await expectTargetSize(button);
    }
  },
};

// Tab キーでフォーカスした状態。focus-ring の黒と黄の 2 重の表示を、VRT で見る。
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("button")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

// 押している状態。storybook-addon-pseudo-states で :active の見た目を出す。
export const Active: Story = {
  parameters: { pseudo: { active: true } },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

// マウスを乗せた状態。storybook-addon-pseudo-states で :hover の見た目を出す。
export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  // 表示の transition が終わるのを待つ
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};
