import { ActionPanel, CopyToClipboardAction, Icon, List, OpenAction } from "@raycast/api";
import { useUsers } from "./slack";
import { User } from "./types";
import { getAccessoryTitle, getIcon, getAccessoryIcon, getSubtitle, showError } from "./utils";
import { SWRConfig } from "swr";
import { cacheConfig } from "./cache";

export default function Command() {
  return (
    <SWRConfig value={cacheConfig}>
      <UserList />
    </SWRConfig>
  );
}

function UserList() {
  const { data, error, isValidating } = useUsers();

  showError(error, "Failed retrieving users");

  return (
    <List isLoading={isValidating}>
      {data?.map((u) => (
        <UserListItem key={u.id} user={u} />
      ))}
    </List>
  );
}

function UserListItem(props: { user: User }) {
  return props.user.realName ? (
    <List.Item
      title={props.user.realName}
      subtitle={getSubtitle(props.user)}
      icon={getIcon(props.user)}
      accessoryTitle={getAccessoryTitle(props.user)}
      accessoryIcon={getAccessoryIcon(props.user)}
      actions={<Actions user={props.user} />}
    />
  ) : null;
}

function Actions(props: { user: User }) {
  return (
    <ActionPanel title={props.user.name}>
      <ActionPanel.Section>
        <OpenChatAction user={props.user} />
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.user.realName && (
          <CopyToClipboardAction
            title="Copy Display Name"
            content={props.user.realName}
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
        {props.user.name && (
          <CopyToClipboardAction
            title="Copy Name"
            content={props.user.name}
            shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}

function OpenChatAction(props: { user: User }) {
  const deeplink = `slack://user?team=${props.user.teamId}&id=${props.user.id}`;
  return <OpenAction icon={Icon.Bubble} title="Open Chat" target={deeplink} />;
}
