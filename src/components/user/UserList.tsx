import { XIcon } from "@/components/icons";
import { UserProfile } from "./UserProfile";

type UserItem = {
  id: string;
  name: string;
  email: string;
};

interface UserListProps {
  users: UserItem[];
  updateMode?: {
    isLoading: boolean;
    setUsers: (users: UserItem[]) => void;
  };
}

export function UserList({ users, updateMode = undefined }: UserListProps) {
  return users.length > 0 ? (
    <ul className="flex flex-row flex-wrap gap-0 rounded-md bg-background-700">
      {users.map((user, idx) => (
        <li className="w-full" key={`user-${user.id}`}>
          {idx >= 1 && <hr className="my-1 mx-2 text-background-500" />}

          <div
            className={`flex flex-row w-full items-start gap-2 px-2 py-1 rounded-sm  text-sm font-semibold ${updateMode?.isLoading ? "bg-background-800 text-background-400" : "bg-background-700 text-background-300"}`}
          >
            <UserProfile user={user} type="list" />
            {updateMode && (
              <button
                className={
                  updateMode.isLoading ? "cursor-default" : "cursor-pointer"
                }
                type="button"
                onClick={() => {
                  if (updateMode.isLoading) return;

                  updateMode.setUsers(users.filter((u) => u.id !== user.id));
                }}
                aria-label="Remover usuário da associação"
              >
                <XIcon size={20} className="mt-1" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-background-300">
      Que tal tentar adicionar algum membro para ajudar?
    </p>
  );
}
