import { DeleteUserAction, User } from "../model";
import { UserCard } from "./user-card.tsx";

interface Props {
  useUsersList: () => User[];
  deleteUserAction: DeleteUserAction;
}

export function UserList({ useUsersList, deleteUserAction }: Props) {
  const users = useUsersList();

  return (
    <div className="flex gap-2 flex-col">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </div>
  );
}
