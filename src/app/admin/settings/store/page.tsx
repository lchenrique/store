import { Store } from "@prisma/client";
import db from "@/lib/db";
import { SettingsForm } from "../components/settings-form";
import { MainContainer } from "@/components/layout/main-container";

async function getStore() {
  return await db.store.findFirst();
}

export default async function StoreSettingsPage() {
  const store = await getStore();

  if (!store) {
    return null;
  }

  return (
    <div className="space-y-6">
      <MainContainer>
        <SettingsForm store={store} />
      </MainContainer>
    </div>
  );
}
