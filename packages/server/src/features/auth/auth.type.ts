import { UserRole } from "src/core/consts/enum";

export interface TokenPayload {
  sub: string;
  role: UserRole;
}