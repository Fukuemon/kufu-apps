import type { Meta, StoryObj } from "@storybook/react-vite";

import { SectionHeading } from "./section-heading.js";

const meta = {
  title: "Patterns/SectionHeading",
  component: SectionHeading,
  args: {
    eyebrow: "Category",
    title: "Section heading",
    description:
      "A reusable heading pattern with optional eyebrow and description text.",
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
