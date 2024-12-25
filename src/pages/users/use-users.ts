import { startTransition, use, useOptimistic, useState } from "react";
import { fetchUsers, User } from "../../shared/api.ts";
import { createUserAction, deleteUserAction } from "./actions.ts";

// Pattern - Render as your fetch
const defaultUsersPromise = fetchUsers()

export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () => startTransition(() => setUsersPromise(fetchUsers()))

  const [createdUsers, optimisticCreate] = useOptimistic([] as User[], (createdUsers, user: User) => [
    ...createdUsers,
    user
  ])

  const [deletedUsersIds, optimisticDelete] = useOptimistic([] as string [], (deletedUsers, id: string) => deletedUsers.concat(id))

  // Optimistic update for user list
  const useUsersList = () => {
    const users = use(usersPromise)

    return users
      .concat(createdUsers)
      .filter((user) => !deletedUsersIds.includes(user.id))
  }

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList
  } as const
}
