import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkButton } from "./link-button.js";

const meta = {
  title: "UI/LinkButton",
  component: LinkButton,
  args: {
    href: "#",
    children: "Link button",
  },
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled link",
  },
};

export const LongLabel: Story = {
  args: {
    children: "図面が固まっていない段階の相談も受け付けているリンクボタン",
  },
};

export const Cta: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <LinkButton href="#" variant="cta" size="cta-sm">
        cta-sm
      </LinkButton>
      <LinkButton href="#" variant="cta" size="cta-lg">
        cta-lg
      </LinkButton>
      <LinkButton href="#" variant="cta" size="cta-hero">
        cta-hero
      </LinkButton>
    </div>
  ),
};
