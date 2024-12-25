import { createUser, deleteUser } from "../../shared/api.ts";

interface CreateUserActionState {
  enteredEmail: string;
  error?: string;
}

export const createUserAction = ({ refetchUsers }: {
  refetchUsers: VoidFunction
}) => async (
  _: CreateUserActionState,
  formData: FormData
): Promise<CreateUserActionState> => {
  const email = formData.get('email') as string;

  try {
    await createUser({
      email, id: crypto.randomUUID()
    })

    refetchUsers()

    return {
      enteredEmail: '',
    }
  } catch (error) {
    return {
      enteredEmail: email,
      error: 'Error while creating user'
    }
  }
}

interface DeleteUserActionState {
  error?: string;
}

export const deleteUserAction = ({ id, refetchUsers }: {
  id: string
  refetchUsers: VoidFunction
}) => async (): Promise<DeleteUserActionState> => {
  try {
    await deleteUser(id)
    refetchUsers()

    return {}
  } catch (error) {
    return {
      error: 'Error while deleting user'
    }
  }
}
