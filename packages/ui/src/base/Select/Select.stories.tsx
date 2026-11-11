import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { Select } from "./Select.js";
import { expectTargetSize } from "../../test/target-size.js";

const meta = {
  title: "コンポーネント/Base/Select",
  component: Select,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    await expectTargetSize(within(canvasElement).getByRole("combobox"));
  },
};

export const Placeholder: Story = {
  render: () => (
    <Select defaultValue="" aria-label="選択肢">
      <option value="" disabled>
        未選択 (placeholder 表示)
      </option>
      <option value="option-a">Option A</option>
    </Select>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Select defaultValue="option-a" aria-invalid aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="option-a" disabled aria-label="選択肢">
      <option value="option-a">Option A</option>
    </Select>
  ),
};

export const LongItems: Story = {
  render: () => (
    <Select defaultValue="long-a" aria-label="選択肢">
      <option value="long-a">
        空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
      </option>
      <option value="long-b">
        駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
      </option>
    </Select>
  ),
};

// マウスを乗せた状態。storybook-addon-pseudo-states で :hover の見た目を出す。
export const Hover: Story = {
  render: () => (
    <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
  ),
  parameters: { pseudo: { hover: true } },
  // 枠の色の transition が終わるのを待つ
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

// Tab キーでフォーカスした状態。focus-ring の表示を、VRT で見る。
export const Focused: Story = {
  render: () => (
    <Select defaultValue="option-a" aria-label="選択肢">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("combobox")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};
