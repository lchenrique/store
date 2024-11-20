import { HeaderLayoutType } from "@/config/layouts";
import { MinimalHeader } from "./minimal-header";
import { ClassicHeader } from "./classic-header";
import { MegaMenuHeader } from "./mega-menu-header";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  variant: HeaderLayoutType;
  user: User | null;
  store: any;
}

export function DynamicHeader({ variant, user, store }: HeaderProps) {
  const headers = {
    classic: ClassicHeader,
    minimal: MinimalHeader,
    'mega-menu': MegaMenuHeader,
    promotional: MinimalHeader, // temporariamente usando MinimalHeader
  };

  const HeaderComponent = headers[variant];
  return <HeaderComponent user={user} store={store} />;
}
