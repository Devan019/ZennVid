import { google } from "googleapis";
import { AUTH_GOOGLE_ID, AUTH_GOOGLE_REDIRECT_URI, AUTH_GOOGLE_SECRET } from "../env_var";

const oauthClient = new google.auth.OAuth2(
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_GOOGLE_REDIRECT_URI
);  

const oauth2 = google.oauth2({
  auth: oauthClient,
  version: 'v2',
});

export const getGoogleAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  return oauthClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

export const getOAuthUser = async (code: string) => {
  const {tokens} = await oauthClient.getToken(code);
  oauthClient.setCredentials(tokens);
  

  const { data } = await oauth2.userinfo.get();
  return {data};
}

export const resetOAuthClient = () => {
  oauthClient.setCredentials({});
};
