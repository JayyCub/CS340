import {UserService} from "../model/service/UserService";
import {FollowService} from "../model/service/FollowService";
import {StatusService} from "../model/service/StatusService";
import {Dynamo_DAOFactory} from "../model/dao/Dynamo/Dynamo_DAOFactory";
import {
  AuthenticateResponse,
  FollowInfoRequest,
  GetFollowCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoadMoreStatusItemsRequest,
  LoadMoreStatusItemsResponse,
  LoadMoreUserItemsRequest,
  LoadMoreUserItemsResponse,
  LoginRequest,
  LogoutRequest,
  PostStatusRequest,
  RegisterRequest,
  Status,
  TweeterResponse
} from "tweeter-shared";

export const _login = async (
  event: LoginRequest
): Promise<AuthenticateResponse> => {
  if (event.password == null) {
    throw new Error("[Bad Request] requested password is null");
  }

  if (event.username == null) {
    throw new Error("[Bad Request] requested username is null");
  }

  let response = new AuthenticateResponse(
    true,
    ...(await new UserService(new Dynamo_DAOFactory()).login(event.username, event.password))
  );

  if (response.user == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  if (response.token == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }
  return response;
};

export const _register = async (
  event: RegisterRequest
): Promise<AuthenticateResponse> => {
  if (event.alias == null) {
    throw new Error("[Bad Request] requested alias is null");
  }

  if (event.firstName == null) {
    throw new Error("[Bad Request] requested firstName is null");
  }
  if (event.imageStringBase64 == null) {
    throw new Error("[Bad Request] requested imageStringBase64 is null");
  }

  if (event.lastName == null) {
    throw new Error("[Bad Request] requested lastName is null");
  }
  if (event.password == null) {
    throw new Error("[Bad Request] requested password is null");
  }

  let response = new AuthenticateResponse(
    ...(await new UserService(new Dynamo_DAOFactory()).register(
      event.firstName,
      event.lastName,
      event.alias,
      event.password,
      event.imageStringBase64
    ))
  );

  if (response.token == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }
  if (response.user == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _getIsFollower = async (
  event: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
  if (event.user == null) {
    throw new Error("[Bad Request] requested user is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  if (event.selectedUser == null) {
    throw new Error("[Bad Request] requested selectedUser is null");
  }

  let response = new GetIsFollowerStatusResponse(
    true,
    await new FollowService(new Dynamo_DAOFactory()).getIsFollowerStatus(
      event.authToken,
      event.user,
      event.selectedUser
    )
  );

  if (response.isFollower == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _getFolloweesCount = async (
  event: FollowInfoRequest
): Promise<GetFollowCountResponse> => {
  if (event.follow == null) {
    throw new Error("[Bad Request] requested follow object is null");
  }
  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  let response = new GetFollowCountResponse(
    true,
    await new FollowService(new Dynamo_DAOFactory()).getFolloweesCount(event.authToken, event.follow)
  );

  if (response.count == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  console.log(response);

  return response;
};

export const _getFollowersCount = async (
  event: FollowInfoRequest
): Promise<GetFollowCountResponse> => {
  if (event.follow == null) {
    throw new Error("[Bad Request] requested follow object is null");
  }
  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  let response = new GetFollowCountResponse(
    true,
    await new FollowService(new Dynamo_DAOFactory()).getFollowersCount(event.authToken, event.follow)
  );

  if (response.count == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  console.log(response);

  return response;
};

export const _follow = async (
  event: FollowInfoRequest
): Promise<TweeterResponse> => {
  if (event.follow == null) {
    throw new Error("[Bad Request] requested follow object is null");
  }
  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  return new TweeterResponse(
    ...(await new FollowService(new Dynamo_DAOFactory()).follow(event.authToken, event.follow))
  );
};

export const _unfollow = async (
  event: FollowInfoRequest
): Promise<TweeterResponse> => {
  if (event.follow == null) {
    throw new Error("[Bad Request] requested follow object is null");
  }
  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  return new TweeterResponse(
    ...(await new FollowService(new Dynamo_DAOFactory()).unfollow(event.authToken, event.follow))
  );
};

export const _getUser = async (
  event: GetUserRequest
): Promise<GetUserResponse> => {
  if (event.alias == null) {
    throw new Error("[Bad Request] requested alias is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  let response = new GetUserResponse(
    true,
    await new UserService(new Dynamo_DAOFactory()).getUser(event.authToken, event.alias)
  );

  if (response.user == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _logout = async (
  event: LogoutRequest
): Promise<TweeterResponse> => {
  if (event.token == null) {
    throw new Error("[Bad Request] requested token is null");
  }

  let success = await new UserService(new Dynamo_DAOFactory()).logout(event.token);

  return new TweeterResponse(success);
};

export const _loadMoreFollowers = async (
  event: LoadMoreUserItemsRequest
): Promise<LoadMoreUserItemsResponse> => {
  if (event.user == null) {
    throw new Error("[Bad Request] requested user is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  if (event.pageSize == null) {
    throw new Error("[Bad Request] requested pageSize is null");
  }

  let response = new LoadMoreUserItemsResponse(
    true,
    ...(await new FollowService(new Dynamo_DAOFactory()).loadMoreFollowers(
      event.authToken,
      event.user,
      event.pageSize,
      event.lastItem
    ))
  );

  if (response.hasMoreItems == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }
  if (response.pageOfUsers == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }
  return response;
};

export const _loadMoreFollowees = async (
  event: LoadMoreUserItemsRequest
): Promise<LoadMoreUserItemsResponse> => {
  if (event.user == null) {
    throw new Error("[Bad Request] requested user is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  if (event.pageSize == null) {
    throw new Error("[Bad Request] requested pageSize is null");
  }

  let response = new LoadMoreUserItemsResponse(
    true,
    ...(await new FollowService(new Dynamo_DAOFactory()).loadMoreFollowees(
      event.authToken,
      event.user,
      event.pageSize,
      event.lastItem
    ))
  );

  if (response.hasMoreItems == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  if (response.pageOfUsers == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _loadMoreFeedItems = async (
  event: LoadMoreStatusItemsRequest
): Promise<LoadMoreStatusItemsResponse> => {
  if (event.user == null) {
    throw new Error("[Bad Request] requested user is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  if (event.pageSize == null) {
    throw new Error("[Bad Request] requested pageSize is null");
  }

  let lastItem;
  if (event.lastItem == null) {
    lastItem = null;
  } else {
    lastItem = Status.fromJson(JSON.stringify(event.lastItem))
  }

  let response = new LoadMoreStatusItemsResponse(
    true,
    ...(await new StatusService(new Dynamo_DAOFactory()).loadMoreFeedItems(
      event.authToken,
      event.user,
      event.pageSize,
      lastItem
    ))
  );

  if (response.hasMoreItems == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  if (response.pageOfStatuses == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _loadMoreStoryItems = async (
  event: LoadMoreStatusItemsRequest
): Promise<LoadMoreStatusItemsResponse> => {
  if (event.user == null) {
    throw new Error("[Bad Request] requested user is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  if (event.pageSize == null) {
    throw new Error("[Bad Request] requested pageSize is null");
  }

  let lastItem;
  if (event.lastItem == null) {
    lastItem = null;
  } else {
    lastItem = Status.fromJson(JSON.stringify(event.lastItem))
  }

  let response = new LoadMoreStatusItemsResponse(
    true,
    ...(await new StatusService(new Dynamo_DAOFactory()).loadMoreStoryItems(
      event.authToken,
      event.user,
      event.pageSize,
      lastItem
    ))
  );

  if (response.hasMoreItems == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }
  if (response.pageOfStatuses == null) {
    throw new Error("[Server Error] Internal Server Error: Check logs for more details.");
  }

  return response;
};

export const _postStatus = async (
  event: PostStatusRequest
): Promise<TweeterResponse> => {
  if (event.newStatus == null) {
    throw new Error("[Bad Request] requested newStatus is null");
  }

  if (event.authToken == null) {
    throw new Error("[Bad Request] requested authToken is null");
  }

  return new TweeterResponse(
    await new StatusService(new Dynamo_DAOFactory()).postStatus(event.authToken, event.newStatus),
    "Successfully posted status"
  );
};