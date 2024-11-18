import db from "@/lib/db";

export async function getStore() {
  return await db.store.findFirst();
}
