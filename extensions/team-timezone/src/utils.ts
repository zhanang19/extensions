import { Icon, ImageMask } from "@raycast/api";
import { codeToEmojiMap } from "./emojis";
import { User } from "./types";

export function getFormattedOffset(user?: User) {
  const offset = user?.timezoneOffset;
  if (!offset) {
    return undefined;
  }

  const localTime = new Date(Date.now() + offset * 1000);
  let result = localTime.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const offsetInHours = offset / 60 / 60 - 1;
  if (offsetInHours === 0) {
    result += ` (Your Timezone)`;
  } else {
    const formattedOffset = offsetInHours === 1 ? `${offsetInHours} Hour` : `${offsetInHours} Hours`;
    result += ` (${formattedOffset})`;
  }

  return result;
}

export function getAvatar(user?: User) {
  return user?.avatarUrl ? { source: user.avatarUrl, mask: ImageMask.Circle } : Icon.Person;
}

export function getStatusEmoji(user?: User) {
  return user?.statusEmoji ? codeToEmojiMap.get(user.statusEmoji) : undefined;
}
