export const resolveAction = (method?: string) => {
  switch (method) {
    case "post":
      return "create";
    case "put":
    case "patch":
      return "update";
    case "delete":
      return "delete";
    default:
      return "view";
  }
};
