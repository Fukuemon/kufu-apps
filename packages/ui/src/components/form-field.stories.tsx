import type { Meta, StoryObj } from "@storybook/react-vite";

import { FormField } from "./form-field.js";
import { Input } from "./input.js";
import { Select } from "./select.js";
import { Textarea } from "./textarea.js";

const meta = {
  title: "UI/FormField",
  component: FormField,
  args: {
    label: "Field label",
    children: <Input placeholder="Input value" />,
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

export const Default: Story = {
  render: () => (
    <FormField
      label="Field label"
      htmlFor="field-default"
      description="Short help text for the input."
    >
      <Input id="field-default" placeholder="Input value" />
    </FormField>
  ),
};

export const Error: Story = {
  render: () => (
    <FormField
      label="Field label"
      htmlFor="field-error"
      error="Enter a valid value."
    >
      <Input
        id="field-error"
        aria-invalid="true"
        defaultValue="Invalid value"
      />
    </FormField>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FormField label="Field label" htmlFor="field-disabled">
      <Input id="field-disabled" disabled placeholder="Disabled input" />
    </FormField>
  ),
};

export const InputDefault: Story = {
  render: () => <Input placeholder="Input value" />,
};

export const InputError: Story = {
  render: () => <Input aria-invalid="true" defaultValue="Invalid value" />,
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
