import { ActionPanel, Icon, List, OpenAction, preferences, showToast, ToastStyle } from "@raycast/api";
import { WebClient } from "@slack/web-api";
import _ from "lodash";
import { useEffect, useState } from "react";
import { User } from "./types";
import { getFormattedOffset, getAvatar, getStatusEmoji } from "./utils";

export default function Command() {
  const { data, error } = useTimezones();

  if (error) {
    showToast(ToastStyle.Failure, "Failed fetching users", error.message);
  }

  return (
    <List isLoading={data === undefined}>
      {data && Object.entries(data).map(([timezone, users]) => <TimezoneListSection key={timezone} users={users} />)}
    </List>
  );
}

function TimezoneListSection(props: { users: User[] }) {
  const firstUser = _.first(props.users);

  return (
    <List.Section title={firstUser?.timezoneLabel} subtitle={getFormattedOffset(firstUser)}>
      {props.users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </List.Section>
  );
}

function UserListItem(props: { user: User }) {
  if (!props.user.realName) {
    return null;
  }

  return (
    <List.Item
      title={props.user.realName}
      subtitle={`@${props.user.name}`}
      icon={getAvatar(props.user)}
      accessoryTitle={props.user.statusText}
      accessoryIcon={getStatusEmoji(props.user)}
      actions={
        <ActionPanel>
          <SendMessageAction user={props.user} />
        </ActionPanel>
      }
    />
  );
}

function SendMessageAction(props: { user: User }) {
  const deeplink = `slack://user?team=${props.user.teamId}&id=${props.user.id}`;
  return <OpenAction icon={Icon.Bubble} title="Send Message" target={deeplink} />;
}

const client = new WebClient(preferences.token.value as string);

function useTimezones() {
  const [timezoneToUsersMap, setTimezoneToUsersMap] = useState<_.Dictionary<User[]>>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await client.users.list({ presence: true });

        const map = _.chain(response.members)
          .filter((m) => !m.is_bot)
          .filter((m) => !m.deleted)
          .filter((m) => m.name !== "slackbot")
          .flatMap((m) => ({
            id: m.id,
            teamId: m.team_id,
            realName: m.real_name,
            name: m.name,
            timezoneLabel: m.tz_label,
            timezone: m.tz,
            timezoneOffset: m.tz_offset,
            avatarUrl: m.profile?.image_72,
            statusEmoji: m.profile?.status_emoji,
            statusText: m.profile?.status_text,
          }))
          .sortBy(["timezoneOffset", "realName"])
          .groupBy("timezone")
          .value();

        setTimezoneToUsersMap(map);
      } catch (error) {
        console.error("Failed fetching users", error);
        setError(error instanceof Error ? error : new Error("Something went wrong"));
      }
    }

    fetchUsers();
  }, []);

  return { data: timezoneToUsersMap, error };
}
