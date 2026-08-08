import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.js";

const meta = {
  title: "UI/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="option-a">
      <SelectTrigger className="w-72">
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
        <SelectItem value="option-b">Option B</SelectItem>
        <SelectItem value="option-c">Option C</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-72">
        <SelectValue placeholder="未選択 (placeholder 表示)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="option-a" disabled>
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-a">Option A</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const LongItems: Story = {
  render: () => (
    <Select defaultValue="long-a">
      <SelectTrigger className="w-72">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="long-a">
          空圧・油圧・真空機器と関連する周辺制御機器および配管部材一式
        </SelectItem>
        <SelectItem value="long-b">
          駆動・変減速機器 (モーター、変減速機、制御機器などの駆動系主要機器)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};
