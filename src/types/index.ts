export interface Store {
  id: string;
  userId: string | null;
  name: string;
  description: string | null;
  logo: string | null;
  palette: string;
  createdAt: Date;
  updatedAt: Date;
  settings: any;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: "ADMIN" | "CUSTOMER";
  };
}

export interface UserStore {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
}
