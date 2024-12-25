import { startTransition, useState } from "react";
import { fetchUsers } from "../../shared/api.ts";

// Pattern - Render as your fetch
const defaultUsersPromise = fetchUsers()

export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => startTransition(() => setUsersPromise(fetchUsers()))

  return {
    usersPromise,
    refetchUsers
  } as const
}
