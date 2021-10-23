import { Icon, ImageMask } from "@raycast/api";
import { User } from "./types";

export function getIcon(user?: User) {
  return user?.avatarUrl ? { source: user.avatarUrl, mask: ImageMask.Circle } : Icon.Person;
}

export function getAccessoryTitle(user?: User) {
  const localTime = getLocalTime(user);
  if (!localTime) {
    return undefined;
  }

  return localTime.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
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
    return undefined;
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
