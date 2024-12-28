import { useActionState } from "react";
import { Link } from "react-router-dom";
import { User, DeleteUserAction } from "../model";

interface Props {
  user: User;
  deleteUserAction: DeleteUserAction;
}

export function UserCard({ user, deleteUserAction }: Props) {
  const [state, handleRemove, isPending] = useActionState(deleteUserAction, {});

  return (
    <div className="flex gap-4 w-full">
      <div className="border py-2 px-4 bg-green-100 w-full">{user.email}</div>

      <form className="flex gap-2" action={handleRemove}>
        <input type="hidden" name="id" value={user.id} />

        <Link
          to={`/${user.id}/tasks`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
        >
          Tasks
        </Link>

        <button
          disabled={isPending}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
        >
          Remove
        </button>
      </form>

      {state && <p>{state.error}</p>}
    </div>
  );
}
