import type { StorybookConfig } from "@storybook-astro/framework";
import { react } from "@storybook-astro/framework/integrations";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook-astro/framework",
    options: {
      integrations: [react()],
    },
  },
};

export default config;
