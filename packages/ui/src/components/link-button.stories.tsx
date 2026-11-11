import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, within } from "storybook/test";

import { LinkButton } from "./link-button.js";
import { expectTargetSize } from "./target-size.js";

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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectTargetSize(within(canvasElement).getByRole("link"));
  },
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
  play: async ({ canvasElement }) => {
    for (const link of within(canvasElement).getAllByRole("link")) {
      await expectTargetSize(link);
    }
  },
};

// Tab キーでフォーカスした状態。focus-ring の表示を、VRT で見る。
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    // 表示の transition が終わるのを待つ
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};

// 暗い面（.surface-inverse）の上でフォーカスした状態。黄の影が暗い面で見分けられることを、VRT で見る。
export const FocusedOnInverse: Story = {
  render: (args) => (
    <div className="surface-inverse bg-surface-canvas p-8">
      <LinkButton {...args} variant="cta" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole("link")).toHaveFocus();
    await new Promise((resolve) => setTimeout(resolve, 400));
  },
};
