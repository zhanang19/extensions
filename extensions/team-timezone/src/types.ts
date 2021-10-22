export interface User {
  id: string | undefined;
  teamId: string | undefined;
  realName: string | undefined;
  name: string | undefined;
  timezoneLabel: string | undefined;
  timezone: string | undefined;
  timezoneOffset: number | undefined;
  avatarUrl: string | undefined;
  statusEmoji: string | undefined;
  statusText: string | undefined;
}
