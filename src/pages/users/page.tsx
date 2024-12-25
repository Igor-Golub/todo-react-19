import { User } from "../../shared/api.ts";
import { Suspense, useActionState, useOptimistic, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CreateUserAction, DeleteUserAction } from "./actions.ts";
import { useUsers } from "./use-users.ts";
import { Link } from "react-router-dom";

export function UsersPage() {
  const { useUsersList, deleteUserAction, createUserAction } = useUsers()

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className='text-3xl font-bold underline'>Users</h1>

      <CreateUserForm createUserAction={createUserAction} />

      <ErrorBoundary fallback={<div className='text-red-500'>Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <UserList useUsersList={useUsersList} deleteUserAction={deleteUserAction} />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

export function CreateUserForm({ createUserAction }: { createUserAction: CreateUserAction; }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, dispatch] = useActionState(createUserAction, { enteredEmail: '' })
  const [optimisticState, setOptimisticState] = useOptimistic(state)

  const handleAction = (formData: FormData) => {
    setOptimisticState({ enteredEmail: '' })
    dispatch(formData)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} className='flex gap-2 w-full' action={handleAction}>
      <input
        type='email'
        name='email'
        placeholder='Enter user email'
        className='border p-2 rounded w-full'
        defaultValue={optimisticState.enteredEmail}
      />

      <button
        type="submit"
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
      >
        Add
      </button>

      {optimisticState.error && <span>{optimisticState.error}</span>}
    </form>
  )
}

export function UserList({ useUsersList, deleteUserAction }: {
  useUsersList: () => User[],
  deleteUserAction: DeleteUserAction
}) {
  const users = useUsersList()

  return <div className='flex flex-col'>
    {users.map((user) => (
      <UserCard key={user.id} user={user} deleteUserAction={deleteUserAction}/>
    ))}
  </div>
}

export function UserCard({ user, deleteUserAction }: {
  user: User,
  deleteUserAction: DeleteUserAction
}) {
  const [state, handleRemove, isPending] = useActionState(deleteUserAction, {})

  return (
    <div className='flex gap-4 w-full'>
      <div className='border py-2 px-4 bg-green-100 w-full'>
        {user.email}
      </div>

      <form className='flex gap-2' action={handleRemove}>
        <input type='hidden' name='id' value={user.id}/>

        <Link
          to={`/${user.id}/tasks`}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
        >
          Tasks
        </Link>

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
