import { User } from "./types.ts";
import { createUser, deleteUser } from "../api";

interface CreateUserActionState {
  enteredEmail: string;
  error?: string;
}

export type CreateUserAction = (
  state: CreateUserActionState,
  formData: FormData,
) => Promise<CreateUserActionState>;

export const createUserAction =
  ({
    refetchUsers,
    optimisticCreate,
  }: {
    refetchUsers: VoidFunction;
    optimisticCreate: (user: User) => void;
  }): CreateUserAction =>
  async (_, formData) => {
    const email = formData.get("email") as string;

    try {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
      };

      optimisticCreate(newUser);
      await createUser(newUser);

      refetchUsers();

      return {
        enteredEmail: "",
      };
    } catch (error) {
      return {
        enteredEmail: email,
        error: "Error while creating user",
      };
    }
  };

interface DeleteUserActionState {
  error?: string;
}

export type DeleteUserAction = (
  state: DeleteUserActionState,
  formData: FormData,
) => Promise<DeleteUserActionState>;

export const deleteUserAction =
  ({
    refetchUsers,
    optimisticDelete,
  }: {
    refetchUsers: VoidFunction;
    optimisticDelete: (id: string) => void;
  }): DeleteUserAction =>
  async (_, formData) => {
    const id = formData.get("id") as string;

    try {
      optimisticDelete(id);
      await deleteUser(id);
      refetchUsers();

      return {};
    } catch (error) {
      return {
        error: "Error while deleting user",
      };
    }
  };
