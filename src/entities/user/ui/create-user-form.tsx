import { CreateUserAction } from "../model/actions.ts";
import { useActionState, useOptimistic, useRef } from "react";

export function CreateUserForm({
  createUserAction,
}: {
  createUserAction: CreateUserAction;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, dispatch] = useActionState(createUserAction, {
    enteredEmail: "",
  });
  const [optimisticState, setOptimisticState] = useOptimistic(state);

  const handleAction = (formData: FormData) => {
    setOptimisticState({ enteredEmail: "" });
    dispatch(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} className="flex gap-2 w-full" action={handleAction}>
      <input
        type="email"
        name="email"
        placeholder="Enter user email"
        className="border p-2 rounded w-full"
        defaultValue={optimisticState.enteredEmail}
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
      >
        Add
      </button>

      {optimisticState.error && <span>{optimisticState.error}</span>}
    </form>
  );
}
