import { AuthToken, FakeData, User } from "tweeter-shared";

export class UserService {
    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        return FakeData.instance.findUserByAlias(alias);
      }
}