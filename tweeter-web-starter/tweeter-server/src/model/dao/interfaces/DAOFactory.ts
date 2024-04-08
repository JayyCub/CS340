import {UsersDAO} from "./UsersDAO";
import {AuthTokensDAO} from "./AuthTokensDAO";
import {ImagesDAO} from "./ImagesDAO";
import {StatusesDAO} from "./StatusesDAO";
import {FollowsDAO} from "./FollowsDAO";
import {FeedsDAO} from "./FeedsDAO";


export interface DAOFactory {
  getAuthTokensDAO(): AuthTokensDAO;
  getFeedsDAO(): FeedsDAO;
  getFollowsDAO(): FollowsDAO;
  getUsersDAO(): UsersDAO;
  getImageDAO(): ImagesDAO;
  getStatusesDAO(): StatusesDAO;
}