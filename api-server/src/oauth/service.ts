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
    include_granted_scopes: true,
    prompt: 'consent'
  });
};

export const getTokens = async (code: string) => {
  try {
    const { tokens } = await oauthClient.getToken(code);
    if (!tokens.access_token || !tokens.id_token) {
      throw new Error('Missing required tokens in response');
    }
    return {
      token: tokens.access_token,
      refreshToken: tokens.refresh_token, // Fixed typo
      idToken: tokens.id_token, // Changed to lowercase for consistency
    };
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error; // Re-throw for controller to handle
  }
}

export const getOAuthUser = async (idToken: any) => {
  const data = await oauthClient.verifyIdToken({idToken});
  return {data};
}

export const refreshToken = async (refreshToken: string) => {
  oauthClient.revokeToken(refreshToken);
}
