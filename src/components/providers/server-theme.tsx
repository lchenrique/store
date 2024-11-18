import { palettes } from '@/config/themes';
import db from '@/lib/db';

async function getInitialPalette() {
  const store = await db.store.findFirst();
  if (store?.palette) {
    return palettes.find(p => p.name === store.palette);
  }
  return null;
}

export function generateThemeCSS(palette: any) {
  if (!palette) return '';

  const lightVars = Object.entries(palette.light)
    .map(([key, value]) => `  --${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`)
    .join('\n');

  const darkVars = Object.entries(palette.dark)
    .map(([key, value]) => `  --${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}: ${value};`)
    .join('\n');

  return `
    :root {
      ${lightVars}
    }
    
    .dark {
      ${darkVars}
    }
  `;
}

export async function ServerTheme() {
  const palette = await getInitialPalette();
  console.log('Server theme:', palette?.name);
  
  const css = generateThemeCSS(palette);

  return (
    <>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <script 
        dangerouslySetInnerHTML={{ 
          __html: `window.__INITIAL_PALETTE__ = ${JSON.stringify(palette?.name || null)};` 
        }} 
      />
    </>
  );
}
