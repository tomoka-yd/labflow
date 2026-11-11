export type UserRole = "user" | "manager";

export type MemberRole =
  "lecturer" | "assistantProfessor" | "researcher" | "student" | "other";

export type Member = {
  id: string;
  name: string;
  role: MemberRole;
  isActive: boolean;
};
