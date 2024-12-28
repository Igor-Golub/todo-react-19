import { use, useOptimistic } from "react";
import { User } from "./types.ts";
import { useUserContext } from "./user-context.tsx";
import { createUserAction, deleteUserAction } from "./actions.ts";

export function useUsers() {
  const { usersPromise, refetchUsers } = useUserContext();

  const [createdUsers, optimisticCreate] = useOptimistic(
    [] as User[],
    (createdUsers, user: User) => [...createdUsers, user],
  );

  const [deletedUsersIds, optimisticDelete] = useOptimistic(
    [] as string[],
    (deletedUsers, id: string) => deletedUsers.concat(id),
  );

  // Optimistic update for user list
  const useUsersList = () => {
    const users = use(usersPromise);

    return users
      .concat(createdUsers)
      .filter((user) => !deletedUsersIds.includes(user.id));
  };

  return {
    createUserAction: createUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
    useUsersList,
  } as const;
}
