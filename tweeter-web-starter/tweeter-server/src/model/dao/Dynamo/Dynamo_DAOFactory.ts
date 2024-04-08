import {DAOFactory} from "../interfaces/DAOFactory";
import {AuthTokensDAO} from "../interfaces/AuthTokensDAO";
import {Dynamo_AuthTokensDAO} from "./Dynamo_AuthTokensDAO";
import {UsersDAO} from "../interfaces/UsersDAO";
import {ImagesDAO} from "../interfaces/ImagesDAO";
import {S3_ImagesDAO} from "./S3_ImagesDAO";
import {Dynamo_UsersDAO} from "./Dynamo_UsersDAO";
import {StatusesDAO} from "../interfaces/StatusesDAO";
import {Dynamo_StatusesDAO} from "./Dynamo_StatusesDAO";
import {FollowsDAO} from "../interfaces/FollowsDAO";
import {Dynamo_FollowsDAO} from "./Dynamo_FollowsDAO";
import {FeedsDAO} from "../interfaces/FeedsDAO";
import {Dynamo_FeedsDAO} from "./Dynamo_FeedsDAO";

export class Dynamo_DAOFactory implements DAOFactory {
  getAuthTokensDAO(): AuthTokensDAO {
    return new Dynamo_AuthTokensDAO();
  }
  getUsersDAO(): UsersDAO {
    return new Dynamo_UsersDAO();
  }
  getImageDAO(): ImagesDAO {
    return new S3_ImagesDAO();
  }

  getStatusesDAO(): StatusesDAO {
    return new Dynamo_StatusesDAO();
  }

  getFollowsDAO(): FollowsDAO {
    return new Dynamo_FollowsDAO();
  }

  getFeedsDAO(): FeedsDAO {
    return new Dynamo_FeedsDAO();
  }
}