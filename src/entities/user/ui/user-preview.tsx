import { useUserContext } from "../model";
import { use } from "react";

interface Props {
  userId: string;
}

export const UserPreview = ({ userId }: Props) => {
  const { usersPromise } = useUserContext();

  const user = use(usersPromise).find((user) => user.id === userId);

  if (!user) return null;

  return <span>{user.email}</span>;
};
