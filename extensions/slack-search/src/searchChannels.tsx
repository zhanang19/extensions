import { ActionPanel, CopyToClipboardAction, List } from "@raycast/api";
import { useChannels } from "./slack";
import { Channel } from "./types";
import { SWRConfig } from "swr";
import { cacheConfig } from "./cache";
import { getAcccessoryTitleForChannel, getIconForChannel, getSubtitleForChannel, showError } from "./utils";

export default function Command() {
  return (
    <SWRConfig value={cacheConfig}>
      <ChannelList />
    </SWRConfig>
  );
}

function ChannelList() {
  const { data, error, isValidating } = useChannels();

  showError(error, "Failed retrieving channels");

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
