import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeading } from "./section-heading.js";

const meta = {
  title: "Patterns/SectionHeading",
  component: SectionHeading,
  args: {
    number: "01",
    eyebrow: "PRODUCTS / 取扱製品",
    title: "製造現場を支える機器を、用途から探す",
    description:
      "駆動・変減速機器から搬送・省力化機器まで、現場の課題に合わせて最適な製品カテゴリを確認できます。",
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Center: Story = {
  args: {
    align: "center",
  },
};
