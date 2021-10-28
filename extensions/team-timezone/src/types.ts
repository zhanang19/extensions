export interface User {
  id?: string;
  teamId?: string;
  realName?: string;
  name?: string;
  timezoneOffset?: number;
  avatarUrl?: string;
}

export interface Channel {
  id?: string;
  name?: string;
  description?: string;
  membersCount?: number;
  type: ChannelType;
}

export enum ChannelType {
  Public = "PUBLIC",
  Private = "PRIVATE",
}
