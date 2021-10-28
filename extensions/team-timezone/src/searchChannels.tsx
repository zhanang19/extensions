import { ActionPanel, CopyToClipboardAction, Icon, List, OpenAction, showToast, ToastStyle } from "@raycast/api";
import { useChannels } from "./slack";
import { Channel, User } from "./types";
import { SWRConfig } from "swr";
import { cacheConfig } from "./cache";
import { getAcccessoryTitleForChannel, getIconForChannel, getSubtitleForChannel } from "./utils";

export default function Command() {
  return (
    <SWRConfig value={cacheConfig}>
      <ChannelList />
    </SWRConfig>
  );
}

function ChannelList() {
  const { data, error, isValidating } = useChannels();

  if (error) {
    console.error(error);
    showToast(ToastStyle.Failure, "Failed retrieving channels", error.message);
  }

  return (
    <List isLoading={isValidating}>
      {data?.map((c) => (
        <ChannelListItem key={c.id} channel={c} />
      ))}
    </List>
  );
}

function ChannelListItem(props: { channel: Channel }) {
  return props.channel.name ? (
    <List.Item
      title={`#${props.channel.name}`}
      subtitle={getSubtitleForChannel(props.channel)}
      icon={getIconForChannel(props.channel)}
      accessoryTitle={getAcccessoryTitleForChannel(props.channel)}
      actions={<Actions channel={props.channel} />}
    />
  ) : null;
}

function Actions(props: { channel: Channel }) {
  return (
    <ActionPanel title={`#${props.channel.name}`}>
      <ActionPanel.Section>{/* <SendMessageAction user={props.user} /> */}</ActionPanel.Section>
      <ActionPanel.Section>
        {props.channel.name && (
          <CopyToClipboardAction
            title="Copy Name"
            content={props.channel.name}
            shortcut={{ modifiers: ["cmd"], key: "." }}
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
