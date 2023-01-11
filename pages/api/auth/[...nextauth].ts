import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { dbUsers } from "../../../database";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
	throw new Error("No hay provedor de Github");
}

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		Credentials({
			name: "Custom Login",
			credentials: {
				email: {
					label: "Correo",
					type: "email",
					placeholder: "correo@google.com",
				},
				password: {
					label: "Contraseña",
					type: "password",
					placeholder: "*******",
				},
			},
			async authorize(credentials: any): Promise<any> {
				return await dbUsers.checkUserEmailPassword(
					credentials?.email,
					credentials?.password
				);
			},
		}),
		// ...add more providers here
	],

	pages: {
		signIn: "/auth/login",
		newUser: "/auth/register",
	},

	jwt: {},

	session: {
		maxAge: 259200,
		strategy: "jwt",
		updateAge: 86400,
	},

	callbacks: {
		async jwt({ token, account, user }: any) {
			if (account) {
				token.accessToken = account.access_token;
				switch (account.type) {
					case "oauth":
						token.user = await dbUsers.oAuthToDbUser(
							user.email || "",
							user.name || ""
						);
						break;
					case "credentials":
						token.user = user;
						break;
				}
			}
			return token;
		},
		async session({ session, token, user }: any) {
			session.accessToken = token.accessToken;
			session.user = token.user as any;

			return session;
		},
	},
};

export default NextAuth(authOptions as any);
