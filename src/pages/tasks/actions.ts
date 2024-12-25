import { createTask, deleteTask } from "../../shared/api.ts";

interface CreateTaskActionState {
  enteredTitle: string;
  error?: string;
}

export type CreateTaskAction = (state: CreateTaskActionState, formData: FormData) => Promise<CreateTaskActionState>;

export const createTaskAction = ({ refetchTasks, userId }: {
  userId: string;
  refetchTasks: VoidFunction;
}): CreateTaskAction => async (_, formData) => {
  const title = formData.get('title') as string;

  try {
    await createTask({
      id: crypto.randomUUID(),
      title,
      userId,
      done: false,
      createdAt: Date.now()
    })

    refetchTasks()

    return {
      enteredTitle: '',
    }
  } catch (error) {
    return {
      enteredTitle: title,
      error: 'Error while creating Task'
    }
  }
}

interface DeleteTaskActionState {
  error?: string;
}

export type DeleteTaskAction = (state: DeleteTaskActionState, formData: FormData) => Promise<DeleteTaskActionState>;

export const deleteTaskAction = ({ refetchTasks }: {
  refetchTasks: VoidFunction,
}): DeleteTaskAction => async (_, formData) => {
  const id = formData.get('id') as string;

  try {
    await deleteTask(id)
    refetchTasks()

    return {}
  } catch (error) {
    return {
      error: 'Error while deleting task'
    }
  }
}
