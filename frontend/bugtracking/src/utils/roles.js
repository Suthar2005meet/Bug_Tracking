const ROLE_MAP = {
  admin: "Admin",
  projectmanager: "ProjectManager",
  manager: "ProjectManager",
  developer: "Developer",
  tester: "Tester",
};

export const normalizeRole = (value = "") =>
  String(value).toLowerCase().replace(/[\s_]+/g, "");

export const getCanonicalRole = (value = "") =>
  ROLE_MAP[normalizeRole(value)] || value;

export const hasRole = (value, expectedRole) =>
  normalizeRole(getCanonicalRole(value)) ===
  normalizeRole(getCanonicalRole(expectedRole));

export const getRoleLabel = (value = "") => {
  switch (getCanonicalRole(value)) {
    case "Admin":
      return "Admin";
    case "ProjectManager":
      return "Project Manager";
    case "Developer":
      return "Developer";
    case "Tester":
      return "Tester";
    default:
      return value || "Unknown";
  }
};
