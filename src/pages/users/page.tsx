import { User } from "../../shared/api.ts";
import { Suspense, use, useActionState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createUserAction, deleteUserAction } from "./actions.ts";
import { useUsers } from "./use-users.ts";

export function UsersPage() {
  const { usersPromise, refetchUsers } = useUsers()

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className='text-3xl font-bold underline'>Users</h1>

      <CreateUserForm refetchUsers={refetchUsers}/>

      <ErrorBoundary fallback={<div className='text-red-500'>Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <UserList usersPromise={usersPromise} refetchUsers={refetchUsers}/>
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: VoidFunction }) {
  const [state, dispatch, isPending] = useActionState(
    createUserAction({ refetchUsers }),
    { enteredEmail: '' })

  return (
    <form className='flex gap-2' action={dispatch}>
      <input
        type='email'
        name='email'
        disabled={isPending}
        className='border p-2 rounded'
        defaultValue={state.enteredEmail}
      />

      <button
        type="submit"
        disabled={isPending}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
      >
        Add
      </button>

      {state.error && <span>{state.error}</span>}
    </form>
  )
}

export function UserList({ usersPromise, refetchUsers }: {
  usersPromise: Promise<User[]>,
  refetchUsers: VoidFunction
}) {
  const users = use(usersPromise);

  return <div className='flex flex-col'>
    {users.map((user) => (
      <UserCard key={user.id} user={user} refetchUsers={refetchUsers}/>
    ))}
  </div>
}

export function UserCard({ user, refetchUsers }: {
  user: User,
  refetchUsers: VoidFunction
}) {
  const [state, handleRemove, isPending] = useActionState(
    deleteUserAction({ id: user.id, refetchUsers }),
    {}
  )

  return (
    <div className='flex gap-2 w-1'>
      <div className='border py-2 px-4 bg-green-100'>
        {user.email}
      </div>

      <form action={handleRemove}>
        <button
          disabled={isPending}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
        >
          Remove
        </button>
      </form>

      {state && <p>{state.error}</p>}
    </div>
  )
}
