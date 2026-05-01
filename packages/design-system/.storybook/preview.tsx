import type { Preview } from "@storybook/react";
import "../src/styles/global.css";
import "../src/styles/tailwind.css";
import "../src/styles/themes.css";
import { ThemeProvider } from "../src/hooks/useTheme";
import { ModalProvider } from "../src/hooks/ModalProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1024px",
            height: "768px",
          },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ModalProvider>
          <div className="min-h-screen bg-background text-foreground p-6">
            <Story />
          </div>
        </ModalProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
