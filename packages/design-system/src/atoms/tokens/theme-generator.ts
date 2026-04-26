import { themes, type ThemeTokens } from './colors';

/**
 * Gera CSS variables a partir dos tokens de tema
 */
export const generateThemeCSS = (): string => {
  let css = '/* CSS Variables geradas automaticamente a partir de colors.ts */\n\n';
  
  // Light theme como padrão
  css += ':root {\n';
  Object.entries(themes.light).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`;
  });
  css += '}\n\n';
  
  // Dark theme
  css += '[data-theme="dark"] {\n';
  Object.entries(themes.dark).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`;
  });
  css += '}\n';
  
  return css;
};

/**
 * Aplica variáveis CSS dinamicamente no DOM
 */
export const applyThemeVariables = (themeName: keyof typeof themes): void => {
  if (typeof window === 'undefined') return;
  
  const themeTokens = themes[themeName];
  const root = document.documentElement;
  
  Object.entries(themeTokens).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

/**
 * Obter valor de um token para o tema atual
 */
export const getThemeToken = (token: ThemeTokens, theme: keyof typeof themes): string => {
  return themes[theme][token];
};

/**
 * Gerar objeto com CSS variables para uso em styled-components ou emotion
 */
export const getThemeVariables = (theme: keyof typeof themes): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  Object.entries(themes[theme]).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });
  
  return variables;
};