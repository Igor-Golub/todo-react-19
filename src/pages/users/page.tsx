import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { CreateUserForm, UserList, useUsers } from "../../entities/user";

export function UsersPage() {
  const { useUsersList, deleteUserAction, createUserAction } = useUsers();

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>

      <CreateUserForm createUserAction={createUserAction} />

      <ErrorBoundary fallback={<div className="text-red-500">Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <UserList
            useUsersList={useUsersList}
            deleteUserAction={deleteUserAction}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
