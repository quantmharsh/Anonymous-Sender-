import "next-auth";
import { DefaultSession } from "next-auth";
// redefining the existing module of next-auth . because we want to add our own user data
//in token. so for that we need to redefine module.we arw doing ot in options.ts callbacks (async jwt)
declare module "next-auth" {
	interface User {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}
	// this is for changing session structur so that there also we can store token data(Which also consists user data)
	interface Session {
		user: {
			_id?: string;
			isVerified?: boolean;
			isAcceptingMessages?: boolean;
			username?: string;
            //in defaultession we are getting a key user which will help us in sending querys
            //it is important. it can also have undefined if  user object is not their
		} & DefaultSession["user"]
	}
}
//doing same chanes in JWT also in diffrent way
declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		isVerified?: boolean;
		isAcceptingMessages?: boolean;
		username?: string;
	}
}
