export const msToHMS = (ms) => {
  let seconds = ms / 1000;
  const hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
  const days = parseInt(hours / 24); // 3,600 seconds in 1 hour
  seconds = seconds % 3600;
  const minutes = parseInt(seconds / 60);
  seconds = seconds % 60;
  let str = "";
  if (days) str += days + "d ";
  if (hours) str += hours - days * 24 + "h ";
  else if (minutes) str += minutes + "m ";
  else if (seconds) str += "just now";
  str += str === "just now" ? "" : "ago";
  return str;
};
