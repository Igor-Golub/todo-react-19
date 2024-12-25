import { createUser, deleteUser, fetchUsers, User } from "../../shared/api.ts";
import { FormEvent, startTransition, Suspense, use, useState, useTransition } from "react";

// Pattern - Render as your fetch
const defaultUsersPromise = fetchUsers()

export function UsersPage() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);

  const refetchUsers = () => startTransition(() => setUsersPromise(fetchUsers()))

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className='text-3xl font-bold underline'>Users</h1>

      <CreateUserForm refetchUsers={refetchUsers}/>

      <Suspense fallback={<>Loading</>}>
        <UserList usersPromise={usersPromise} refetchUsers={refetchUsers}/>
      </Suspense>
    </main>
  )
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: VoidFunction }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Stale while revalidate: Eliminate origin latency
    startTransition(async () => {
      await createUser({ email: 'email@gmail.com', id: crypto.randomUUID() })
      refetchUsers()
    })
  }

  return (
    <form className='flex gap-2' onSubmit={handleSubmit}>
      <input
        type='email'
        disabled={isPending}
        className='border p-2 rounded'
      />

      <button
        type="submit"
        disabled={isPending}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
      >
        Add
      </button>
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
  const [isPending, startTransition] = useTransition()

  const handleRemove = () => {
    startTransition(async () => {
      await deleteUser(user.id)
      refetchUsers()
    })
  }

  return (
    <div className='flex gap-2 w-1'>
      <div className='border py-2 px-4 bg-green-100'>
        {user.email}
      </div>

      <button
        type='button'
        disabled={isPending}
        onClick={handleRemove}
        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
      >
        Remove
      </button>
    </div>
  )
}
