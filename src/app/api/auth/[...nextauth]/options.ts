import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/model/User";

//This is for Login Using NextAuth
export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			//this is creating form
			credentials: {
				email: { label: "Email", type: "text", placeholder: "Enter Email" },
				password: { label: "Password", type: "enter password" },
			},
			//to authorize user this is custom method
			async authorize(credentials: any): Promise<any> {
				//connecting db
				await dbConnect();
				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});
					if (!user) {
						throw new Error("No user find with this email");
					}
					//if user is find but is not verified
					if (!user.isVerified) {
						throw new Error(" Please Verify your account before login");
					}
					// credentials.password this should be written like this only
					const isPasswordCorrect = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect Password ");
					}
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
	],
	callbacks: {
		//user we are getting is from providers  the user which we are returning .
		//here we are making token more powerfull .we are injecting data from user to token
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerified;
				token.isAcceptingMessages = user.isAcceptingMessages;
				token.username = user.username;
			}
			return token;
		},
		async session({ session, token }) {
            if(token)
                {
                    session.user._id=token._id
                    session.user.isVerified=token.isVerified
                    session.user.isAcceptingMessages=token.isAcceptingMessages
                    session.user.username=token.username
                }
			return session;
		},
	},
	//next auth will take care of signIn page i dont need to make it, it will create it
	//with the help of credentials that we have provided

	pages: {
		signIn: '/sign-in',
	},
	//session  is used for strategy
	//this means only those user  can login who have jwt  token
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
