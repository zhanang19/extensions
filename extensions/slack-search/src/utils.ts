import { Color, Icon, ImageMask, showToast, ToastStyle } from "@raycast/api";
import { Channel, ChannelType, User } from "./types";

export function getSubtitle(user?: User) {
  return user ? `@${user.name}` : undefined;
}

export function getSubtitleForChannel(channel: Channel) {
  const count = channel.membersCount ?? 0;

  if (count === 0) {
    return undefined;
  } else if (count === 1) {
    return "1 Member";
  } else {
    return `${channel.membersCount} Members`;
  }
}

export function getIcon(user?: User) {
  return user?.avatarUrl ? { source: user.avatarUrl, mask: ImageMask.Circle } : Icon.Person;
}

export function getIconForChannel(channel: Channel) {
  let source: string;

  switch (channel.type) {
    case ChannelType.Private:
      source = "private-channel.png";
      break;
    case ChannelType.Public:
      source = "channel.png";
      break;
  }

  return { source, tintColor: Color.SecondaryText };
}

export function getAccessoryTitle(user?: User) {
  const localTime = getLocalTime(user);
  if (!localTime) {
    return undefined;
  }

  return localTime.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function getAcccessoryTitleForChannel(channel: Channel) {
  return channel.description;
}

export function getAccessoryIcon(user?: User) {
  const localTime = getLocalTime(user);
  if (!localTime) {
    return undefined;
  }

  return dateToEmoji(localTime);
}

function getLocalTime(user?: User) {
  const offset = user?.timezoneOffset;
  if (!offset) {
    return new Date();
  }

  return new Date(Date.now() + offset * 1000);
}

const hourToEmojiMap = new Map<number, string>([
  [0, "🕛"],
  [1, "🕐"],
  [2, "🕑"],
  [3, "🕒"],
  [4, "🕓"],
  [5, "🕔"],
  [6, "🕕"],
  [7, "🕖"],
  [8, "🕗"],
  [9, "🕘"],
  [10, "🕙"],
  [11, "🕚"],
  [0.5, "🕧"],
  [1.5, "🕜"],
  [2.5, "🕝"],
  [3.5, "🕞"],
  [4.5, "🕟"],
  [5.5, "🕠"],
  [6.5, "🕡"],
  [7.5, "🕢"],
  [8.5, "🕣"],
  [9.5, "🕤"],
  [10.5, "🕥"],
  [11.5, "🕦"],
]);

function dateToEmoji(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours > 11) {
    hours = hours - 12;
  }

  minutes = minutes / 60;

  if (minutes < 0.25) {
    minutes = 0;
  } else if (minutes >= 0.25 && minutes < 0.75) {
    minutes = 0.5;
  } else {
    hours = hours === 11 ? 0 : hours + 1;
    minutes = 0;
  }

  return hourToEmojiMap.get(hours + minutes);
}

export async function showError<T>(
  error: T | Promise<T> | (() => T) | (() => Promise<T>),
  title = "Something went wrong"
) {
  if (!error) {
    return;
  }

  const unwrappedError = error instanceof Function ? error() : error;
  const resolvedError = await Promise.resolve(unwrappedError);
  const message = resolvedError
    ? resolvedError instanceof Error
      ? resolvedError.message
      : String(resolvedError)
    : undefined;

  await showToast(ToastStyle.Failure, title, message);
}
