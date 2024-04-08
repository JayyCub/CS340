import { User } from "./User";

export class Follow {
    private _follower: User;
    private _followee: User;

    public constructor(follower: User, followee: User) {
        this._follower = follower;
        this._followee = followee;
    }

    public get follower(): User {
        return this._follower;
    }

    public set follower(value: User) {
        this._follower = value;
    }
    
    public get followee(): User {
        return this._followee;
    }

    public set followee(value: User) {
        this._followee = value;
    }

    public static fromJson(json: string | null | undefined): Follow | null {
        if (!!json){
            let jsonObject: {
                _follower: {
                    _firstName: string;
                    _lastName: string;
                    _alias: string;
                    _imageUrl: string;
                };
                _followee: {
                    _firstName: string;
                    _lastName: string;
                    _alias: string;
                    _imageUrl: string;
                };
            } = JSON.parse(json);
            return new Follow(
              new User(
                jsonObject._follower._firstName,
                jsonObject._follower._lastName,
                jsonObject._follower._alias,
                jsonObject._follower._imageUrl
              ),
              new User(
                jsonObject._followee._firstName,
                jsonObject._followee._lastName,
                jsonObject._followee._alias,
                jsonObject._followee._imageUrl
              ),
            );
        } else {
            return null
        }
    }
}
