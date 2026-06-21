import type { Meta, StoryObj } from "@storybook/react-vite";

import { DefinitionRow } from "./definition-row.js";

const meta = {
  title: "Patterns/DefinitionRow",
  component: DefinitionRow,
  args: {
    term: "Label",
    children: "Definition value",
  },
  decorators: [
    (Story) => (
      <dl className="max-w-2xl">
        <Story />
      </dl>
    ),
  ],
} satisfies Meta<typeof DefinitionRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const MultipleRows: Story = {
  render: () => (
    <>
      <DefinitionRow term="Status">Ready</DefinitionRow>
      <DefinitionRow term="Owner">Shared UI</DefinitionRow>
      <DefinitionRow term="Updated">2026-06-20</DefinitionRow>
    </>
  ),
};
