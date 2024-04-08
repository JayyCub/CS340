import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";
import {Follow} from "../domain/Follow";
import sha256 from 'crypto-js/sha256';
import CryptoJS from "crypto-js/core";


export class TweeterRequest {}

/**
 * UserService Requests
 */
export class GetUserRequest extends TweeterRequest {
  authToken: AuthToken;
  alias: string;

  constructor(authToken: AuthToken, alias: string) {
    super();
    this.authToken = authToken;
    this.alias = alias;
  }
}

export class LoginRequest extends TweeterRequest {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    super();
    this.username = username;
    this.password = sha256(password).toString(CryptoJS.enc.Base64);
  }
}

export class RegisterRequest extends TweeterRequest {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageStringBase64: string;

  constructor(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string
  ) {
    super();
    this.firstName = firstName;
    this.lastName = lastName;
    this.alias = alias;
    this.password = sha256(password).toString(CryptoJS.enc.Base64);
    this.imageStringBase64 = imageStringBase64;
  }
}

export class LogoutRequest extends TweeterRequest {
  token: AuthToken;

  constructor(token: AuthToken) {
    super();
    this.token = token;
  }
}

/**
 * StatusService Requests
 */

export class LoadMoreStatusItemsRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  pageSize: number;
  lastItem: Status | null;

  constructor(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
  ) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.pageSize = pageSize;
    this.lastItem = lastItem;
  }
}

export class PostStatusRequest extends TweeterRequest {
  authToken: AuthToken;
  newStatus: Status;

  constructor(authToken: AuthToken, newStatus: Status) {
    super();
    this.authToken = authToken;
    this.newStatus = newStatus;
  }
}

/**
 * FollowService Requests
 */

export class LoadMoreUserItemsRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  pageSize: number;
  lastItem: User | null;

  constructor(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.pageSize = pageSize;
    this.lastItem = lastItem;
  }
}

export class GetIsFollowerStatusRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  selectedUser: User;

  constructor(authToken: AuthToken, user: User, selectedUser: User) {
    super();
    this.authToken = authToken;
    this.user = user;
    this.selectedUser = selectedUser;
  }
}

export class FollowInfoRequest extends TweeterRequest {
  authToken: AuthToken;
  follow: Follow;

  constructor(authToken: AuthToken, follow: Follow) {
    super();
    this.authToken = authToken;
    this.follow = follow;
  }
}