import {
  createMiddleware,
  MiddlewareFunctionProps,
  type MiddlewareConfig,
  type MiddlewareFunction,
} from "@rescale/nemo";
import { NextResponse } from "next/server";

const MIDDLEWARE_SKIP_KEY = "__skipMiddlewareExecution";

const createSkippableMiddleware = (middlewareFunction: MiddlewareFunction) => {
  return async ({
    context,
    response,
    event,
    request,
  }: MiddlewareFunctionProps) => {
    if (context.get(MIDDLEWARE_SKIP_KEY)) {
      return response;
    }

    return middlewareFunction({ context, response, event, request });
  };
};

const stopFutureMiddlewareExecution = (context: Map<string, unknown>) => {
  context.set(MIDDLEWARE_SKIP_KEY, true);
};

const redirectNonAdminUserMiddleware: MiddlewareFunction = ({
  response,
  request,
}) => {
  if (true) {
    console.log("Redirecting user to home page");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

const additionalMiddlewareAfterFirst: MiddlewareFunction = ({ response }) => {
  console.log("This is an additional middleware for admin routes");
  return response;
};

const rewriteNonAdminUserMiddleware: MiddlewareFunction = ({
  response,
  request,
}) => {
  if (true) {
    console.log("Rewriting user to home page");
    return NextResponse.rewrite(new URL("/", request.url));
  }

  return response;
};

const redirectNonAdminUserMiddlewareSkippable: MiddlewareFunction = ({
  response,
  request,
  context,
}) => {
  if (true) {
    console.log(
      "Redirecting user to home page, but marking others for skipping"
    );
    stopFutureMiddlewareExecution(context);
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
};

const additionalMiddlewareAfterFirstSkippable = createSkippableMiddleware(
  ({ response }) => {
    console.log(
      "This is an additional middleware that won't be logged after the first middleware"
    );
    return response;
  }
);

const middlewareMap: MiddlewareConfig = {
  "/admin*": [redirectNonAdminUserMiddleware, additionalMiddlewareAfterFirst],
  "/dashboard*": [
    rewriteNonAdminUserMiddleware,
    additionalMiddlewareAfterFirst,
  ],
  "/skip*": [
    redirectNonAdminUserMiddlewareSkippable,
    additionalMiddlewareAfterFirstSkippable,
  ],
};

export const middleware = createMiddleware(middlewareMap);

export const config = {
  matcher: ["/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
