export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: Date;
};

export type CreateUserDTO = {
  name: string;
  email: string;
};