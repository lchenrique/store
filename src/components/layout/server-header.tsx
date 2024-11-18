import { getStore } from "@/lib/store";
import { ClientHeader } from "./header";

export async function Header() {
  const store = await getStore();
  
  return <ClientHeader store={store}/>;
}
