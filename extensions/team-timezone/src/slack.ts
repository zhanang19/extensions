import { preferences } from "@raycast/api";
import { WebClient, UsersListResponse, ConversationsListResponse } from "@slack/web-api";
import _ from "lodash";
import useSWR from "swr";
import { Channel, ChannelType, User } from "./types";

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

async function fetchChannels() {
  const allChannels = new Array<Channel>();

  for await (const page of client.paginate("conversations.list", {
    exclude_archived: true,
    types: "public_channel, private_channel",
  })) {
    const channels = _((page as ConversationsListResponse).channels)
      .flatMap((c) => ({
        id: c.id,
        name: c.name,
        description: c.topic?.value ?? c.purpose?.value,
        membersCount: c.num_members,
        type: c.is_private ? ChannelType.Private : ChannelType.Public,
      }))
      .value();

    allChannels.push(...channels);
  }

  return _(allChannels).sortBy("name").value();
}

export function useChannels() {
  return useSWR("conversations", fetchChannels);
}

export function useUsers() {
  return useSWR("users", fetchUsers);
}
