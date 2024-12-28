import { Route, Routes } from "react-router-dom";
import { UsersPage } from "../pages/users";
import { TasksPage } from "../pages/tasks";
import { UserContextProvider } from "../entities/user";

export function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/:userId/tasks" element={<TasksPage />} />
      </Routes>
    </UserContextProvider>
  );
}
