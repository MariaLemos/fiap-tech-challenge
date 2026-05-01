import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: undefined,
      },
    },
  },
  viteFinal: (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': '/src',
        },
      },
      server: {
        watch: {
          usePolling: false,
          useFsEvents: true,
        },
        hmr: {
          overlay: true,
        },
      },
      optimizeDeps: {
        exclude: ['@storybook/blocks'],
      },
    });
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;