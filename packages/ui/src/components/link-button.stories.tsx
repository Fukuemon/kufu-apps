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

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <LinkButton href="#">Default</LinkButton>
      <LinkButton href="#" variant="secondary">
        Secondary
      </LinkButton>
      <LinkButton href="#" variant="outline">
        Outline
      </LinkButton>
      <LinkButton href="#" variant="ghost">
        Ghost
      </LinkButton>
      <LinkButton href="#" variant="destructive">
        Destructive
      </LinkButton>
      <LinkButton href="#" variant="link">
        Link
      </LinkButton>
    </div>
  ),
};

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
