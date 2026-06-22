import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button.js";
import { LinkButton } from "./link-button.js";

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const LinkButtonDefault: Story = {
  render: () => <LinkButton href="#">Link button</LinkButton>,
};

export const LinkButtonVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <LinkButton href="#">Default link</LinkButton>
      <LinkButton href="#" variant="secondary">
        Secondary link
      </LinkButton>
      <LinkButton href="#" variant="outline">
        Outline link
      </LinkButton>
      <LinkButton href="#" disabled>
        Disabled link
      </LinkButton>
    </div>
  ),
};
