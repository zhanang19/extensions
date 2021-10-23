import { getLocalStorageItem, preferences, setLocalStorageItem } from "@raycast/api";
import { WebClient, UsersListResponse } from "@slack/web-api";
import _ from "lodash";
import { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { User } from "./types";

export function useUsers() {
  const [state, setState] = useState<{ users?: User[]; error?: Error; isLoading: boolean }>({ isLoading: true });

  useAsyncEffect(async () => {
    try {
      let users = await readUsersFromCache();
      setState((oldState) => ({ ...oldState, users }));

      users = await fetchUsers();
      setState((oldState) => ({ ...oldState, users, isLoading: false }));

      await writeUsersToCache(users);
    } catch (error) {
      console.error("Failed fetching users", error);

      setState((oldState) => ({
        ...oldState,
        error: error instanceof Error ? error : new Error("Something went wrong"),
        isLoading: false,
      }));
    }
  }, []);

  return state;
}

const client = new WebClient(preferences.token.value as string);

async function fetchUsers() {
  const allUsers = new Array<User>();

  for await (const page of client.paginate("users.list")) {
    const users = _((page as UsersListResponse).members)
      .filter((m) => !m.is_bot)
      .filter((m) => !m.deleted)
      .filter((m) => m.name !== "slackbot")
      .flatMap((m) => ({
        id: m.id,
        teamId: m.team_id,
        realName: m.real_name,
        name: m.name,
        timezoneOffset: m.tz_offset,
        avatarUrl: m.profile?.image_72,
      }))
      .value();

    allUsers.push(...users);
  }

  return _(allUsers).sortBy("realName").value();
}
const USERS_CACHE_KEY = "USERS";

async function writeUsersToCache(users: User[]) {
  const value = JSON.stringify(users);
  await setLocalStorageItem(USERS_CACHE_KEY, value);
}

async function readUsersFromCache() {
  const value = await getLocalStorageItem<string>(USERS_CACHE_KEY);
  return value ? (JSON.parse(value) as User[]) : [];
}
