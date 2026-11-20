import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient();

export function authWithCallbackTo<TCallbackURL extends string>(callbackURL: TCallbackURL): void {
  authClient.signIn.social({
    provider: "google",
    callbackURL,
  });
}
