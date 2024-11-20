import { palettes } from '@/config/themes';
import db from '@/lib/db';

export async function getInitialPalette() {
  const store = await db.store.findFirst();
  if (store?.palette) {
    return store.palette;
  }
  return null;
}
