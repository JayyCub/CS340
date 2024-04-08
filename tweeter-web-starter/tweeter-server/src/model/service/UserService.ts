import {UsersDAO} from "../dao/interfaces/UsersDAO";
import {AuthTokensDAO} from "../dao/interfaces/AuthTokensDAO";
import {ImagesDAO} from "../dao/interfaces/ImagesDAO";
import {DAOFactory} from "../dao/interfaces/DAOFactory";
import {AuthToken, User} from "tweeter-shared";

export class UserService {
  private usersDAO: UsersDAO;
  private authTokensDAO: AuthTokensDAO;
  private imagesDAO: ImagesDAO;

  constructor(daoFactory: DAOFactory) {
    this.authTokensDAO = daoFactory.getAuthTokensDAO();
    this.usersDAO = daoFactory.getUsersDAO();
    this.imagesDAO = daoFactory.getImageDAO();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }

    let auth: boolean = await this.authTokensDAO.validateToken(newToken);
    if (!auth) {
      throw new Error("[Server Error] Could not validate Auth Token");
    }

    return await this.usersDAO.getUser(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {

    let user = await this.usersDAO.loginUser(alias, password);
    if (user === null || user === undefined) {
      throw new Error("[Bad Request] Invalid alias or password");
    }

    let authToken = await this.authTokensDAO.putAuthToken(AuthToken.Generate(), alias);
    if (authToken === null) {
      throw new Error("[Server Error] Could not create auth token.");
    }

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ): Promise<[boolean, User, AuthToken]> {
    let imageUrl = await this.imagesDAO.putImage(alias+"_image", imageStringBase64);

    let user = await this.usersDAO.registerUser(
      new User(firstName, lastName, alias, imageUrl, password));

    if (user === null) {
      throw new Error("[Bad Request] Invalid registration.");
    }

    let authToken = await this.authTokensDAO.putAuthToken(AuthToken.Generate(), alias);
    if (authToken === null) {
      throw new Error("[Server Error] Could not create auth token.");
    }

    return [true, user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<boolean> {
    let newToken = AuthToken.fromJson(JSON.stringify(authToken));
    if (!newToken?.token) {
      throw new Error("[Bad Request] Missing auth token string");
    }
      return await this.authTokensDAO.deleteToken(newToken);
  }
}
