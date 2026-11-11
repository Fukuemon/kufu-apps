import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select } from "./select.js";

const meta = {
  title: "UI/Select",
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
