import { User } from "./types.ts";
import {
  createContext,
  PropsWithChildren,
  startTransition,
  use,
  useState,
} from "react";
import { fetchUsers } from "../api";

interface IUserContext {
  usersPromise: Promise<User[]>;
  refetchUsers: VoidFunction;
}

const UserContext = createContext<IUserContext | null>(null);

// Pattern - Render as your fetch
const defaultUsersPromise = fetchUsers();
export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  return (
    <UserContext value={{ refetchUsers, usersPromise }}>{children}</UserContext>
  );
};

export function useUserContext() {
  const context = use(UserContext);

  if (!context) {
    throw new Error("Context null");
  }

  return context;
}
