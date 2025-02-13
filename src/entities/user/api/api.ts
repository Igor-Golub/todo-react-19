import { User } from "../model";

export async function fetchUsers() {
  return fetch("http://localhost:3001/users").then(
    (res) => res.json() as Promise<User[]>,
  );
}

export async function createUser(user: User) {
  return fetch("http://localhost:3001/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => res.json());
}

export async function deleteUser(id: string) {
  return fetch(`http://localhost:3001/users/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
