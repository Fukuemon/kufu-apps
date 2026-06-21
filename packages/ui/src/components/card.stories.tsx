import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardDescription, CardHeader, CardTitle } from "./card.js";

const meta = {
  title: "Primitives/Card",
  component: Card,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[260px]">
      <div className="h-[150px] w-full bg-[color-mix(in_srgb,var(--kufu-gray-600),var(--kufu-teal-900)_12%)]" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription className="font-mono font-medium tracking-[1px] text-primary">
            CATEGORY 01
          </CardDescription>
          <CardDescription>17社</CardDescription>
        </div>
        <CardTitle>駆動・変減速機器</CardTitle>
      </CardHeader>
    </Card>
  ),
};
