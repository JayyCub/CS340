import {User} from "tweeter-shared";

export abstract class UsersDAO {
  // REGISTER NEW USER
  abstract registerUser(user: User): Promise<User>;

  // LOGIN USER (Check if user in DB)
  abstract loginUser(alias: string, password: string): Promise<User | undefined>;

  // Check if user in DB and return user
  abstract getUser(alias: string): Promise<User | null>;

}