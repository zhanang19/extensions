import { ActionPanel, CopyToClipboardAction, Icon, List, OpenAction, showToast, ToastStyle } from "@raycast/api";
import { useUsers } from "./useUsers";
import { User } from "./types";
import { getAccessoryTitle, getIcon, getAccessoryIcon } from "./utils";

export default function Command() {
  const { users, error, isLoading } = useUsers();

  if (error) {
    showToast(ToastStyle.Failure, "Failed fetching users", error.message);
  }

  return (
    <List isLoading={isLoading}>
      {users?.map((u) => (
        <UserListItem key={u.id} user={u} />
      ))}
    </List>
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
      icon={getIcon(props.user)}
      accessoryTitle={getAccessoryTitle(props.user)}
      accessoryIcon={getAccessoryIcon(props.user)}
      actions={<Actions user={props.user} />}
    />
  );
}

function Actions(props: { user: User }) {
  return (
    <ActionPanel title={props.user.name}>
      <ActionPanel.Section>
        <SendMessageAction user={props.user} />
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

function SendMessageAction(props: { user: User }) {
  const deeplink = `slack://user?team=${props.user.teamId}&id=${props.user.id}`;
  return <OpenAction icon={Icon.Bubble} title="Send Message" target={deeplink} />;
}
