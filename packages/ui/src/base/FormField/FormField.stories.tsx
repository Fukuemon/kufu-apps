import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { FormField } from "./FormField.js";
import { TextInput } from "../TextInput/TextInput.js";
import { Select } from "../Select/Select.js";
import { Textarea } from "../Textarea/Textarea.js";

const meta = {
  title: "コンポーネント/Base/FormField",
  component: FormField,
  args: {
    label: "Field label",
    children: <TextInput placeholder="Input value" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

// VRT は内容の高さで撮るので、最後の行の下端が画像で切れる。足した story だけ、下に余白を置く。
// 既存の story に付けると、baseline の画像が変わる。
const withBottomSpace: Decorator = (Story) => (
  <div className="pb-4">
    <Story />
  </div>
);

export const Default: Story = {
  render: () => (
    <FormField
      label="Field label"
      htmlFor="field-default"
      description="Short help text for the input."
    >
      <TextInput id="field-default" placeholder="Input value" />
    </FormField>
  ),
  // 補足だけがあるとき、欄の説明は補足の文になり、誤りと必須の状態は付かない。
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label",
    });
    await expect(input).toHaveAccessibleDescription(
      "Short help text for the input.",
    );
    await expect(input).toBeValid();
    await expect(input).not.toBeRequired();
  },
};

export const Error: Story = {
  render: () => (
    <FormField
      label="Field label"
      htmlFor="field-error"
      error="Enter a valid value."
    >
      <TextInput id="field-error" defaultValue="Invalid value" />
    </FormField>
  ),
  // 誤りだけがあるとき、欄に aria-invalid が付き、欄の説明は誤りの文になる。
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label",
    });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription("Enter a valid value.");
  },
};

export const Disabled: Story = {
  render: () => (
    <FormField label="Field label" htmlFor="field-disabled">
      <TextInput id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>
  ),
  // 補足も誤りも無いとき、aria-describedby を出さない。
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label",
    });
    await expect(input).not.toHaveAttribute("aria-describedby");
    await expect(input).not.toHaveAttribute("aria-invalid");
  },
};

export const ErrorWithDescription: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField
      label="Field label"
      description="Short help text for the input."
      error="Enter a valid value."
    >
      <TextInput defaultValue="Invalid value" />
    </FormField>
  ),
  // 補足と誤りの両方があるとき、欄の説明は補足の文に続けて誤りの文を読む。htmlFor を渡さなくても結ばれる。
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Field label",
    });
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(
      "Short help text for the input. Enter a valid value.",
    );
  },
};

export const Required: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField
      label="Field label"
      description="Short help text for the input."
      required
    >
      <TextInput placeholder="Input value" />
    </FormField>
  ),
  // 必須は「必須」の文字で示し、欄に required を付ける。
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("必須")).toBeVisible();
    const input = canvas.getByRole("textbox", { name: /Field label/ });
    await expect(input).toBeRequired();
    await expect(input).toHaveAccessibleName(/必須/);
  },
};

export const Optional: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField label="Field label" optional>
      <TextInput placeholder="Input value" />
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("任意")).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: /Field label/ }),
    ).not.toBeRequired();
  },
};

export const LongLabel: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField label="ラベルが長文になった場合の折り返しを確認するための項目名 (必須・全角 40 文字程度)">
      <TextInput placeholder="Input value" />
    </FormField>
  ),
};

export const SelectRequiredError: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField
      label="Field label"
      description="Choose one option."
      error="Select an option."
      required
    >
      <Select defaultValue="">
        <option value="">Select an option</option>
        <option value="option-a">Option A</option>
      </Select>
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole("combobox", {
      name: /Field label/,
    });
    await expect(select).toBeRequired();
    await expect(select).toBeInvalid();
    await expect(select).toHaveAccessibleDescription(
      "Choose one option. Select an option.",
    );
  },
};

export const TextareaRequiredError: Story = {
  decorators: [withBottomSpace],
  render: () => (
    <FormField
      label="Field label"
      description="Describe the request."
      error="Enter at least 10 characters."
      required
    >
      <Textarea defaultValue="Short" />
    </FormField>
  ),
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox", {
      name: /Field label/,
    });
    await expect(textarea).toBeRequired();
    await expect(textarea).toBeInvalid();
    await expect(textarea).toHaveAccessibleDescription(
      "Describe the request. Enter at least 10 characters.",
    );
  },
};

export const InputDefault: Story = {
  render: () => <TextInput placeholder="Input value" />,
};

export const InputError: Story = {
  render: () => <TextInput aria-invalid="true" defaultValue="Invalid value" />,
};

export const SelectDefault: Story = {
  render: () => (
    <Select defaultValue="option-a" aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
      <option value="option-c">Option C</option>
    </Select>
  ),
};

export const SelectDisabled: Story = {
  render: () => (
    <Select defaultValue="option-a" disabled aria-label="Field label">
      <option value="option-a">Option A</option>
      <option value="option-b">Option B</option>
    </Select>
  ),
};

export const TextareaDefault: Story = {
  render: () => <Textarea placeholder="Textarea value" />,
};

export const TextareaError: Story = {
  render: () => <Textarea aria-invalid="true" defaultValue="Invalid value" />,
};
