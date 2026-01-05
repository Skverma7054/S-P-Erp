import { MODULE_MAP } from "./module";

export const resolveModule = () => {
  const path = window.location.pathname;

  // longest match wins
  const matched = Object.keys(MODULE_MAP)
    .sort((a, b) => b.length - a.length)
    .find((route) => path.startsWith(route));

  return matched ? MODULE_MAP[matched] : "Unknown Module";
};
