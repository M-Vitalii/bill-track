import { User } from 'src/database/entities';

export type AuthenticatedUser = Omit<
  User,
  'hashedPassword' | 'hashedRefreshToken'
>;
