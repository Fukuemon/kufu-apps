import type { Meta, StoryObj } from "@storybook/react-vite";

import { DefinitionRow } from "./DefinitionRow.js";

const meta = {
  title: "コンポーネント/Base/DefinitionRow",
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

export const Compact: Story = {
  render: () => (
    <>
      <DefinitionRow layout="compact" term="Status">
        Ready
      </DefinitionRow>
      <DefinitionRow layout="compact" term="Owner">
        Shared UI
      </DefinitionRow>
    </>
  ),
};

export const LongValue: Story = {
  args: {
    term: "事業内容",
    children:
      "産業機械部品の販売、精密機械加工、治具設計、省力化機器の提案など、値が長文になった場合の折り返しと行間を確認するための説明文をここに連ねている。",
  },
};
