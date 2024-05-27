import { NextResponse  , NextRequest} from "next/server";
// import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	// get url where we are
	const url = request.nextUrl;
    //if url is anyone of this then redirect to dashboard page
	if (
		token &&
		(url.pathname.startsWith("/sign-in") ||
			url.pathname.startsWith("/sign-up") ||
			url.pathname.startsWith("/verify") ||
			url.pathname.startsWith("/"))
	) {
		return NextResponse.redirect(new URL("/dashboard ", request.url));
	}
	// return NextResponse.redirect(new URL("/home", request.url));
	if(!token &&url.pathname.startsWith("/dashboard") )
		{
			return NextResponse.redirect(new URL("/sign-in ", request.url));
		}
		return NextResponse.next();
}

// See "Matching Paths" below to learn more
//it is a file where we want that our middleware should run . it consists of all the path
export const config = {
	matcher: ['/sign-in', "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
