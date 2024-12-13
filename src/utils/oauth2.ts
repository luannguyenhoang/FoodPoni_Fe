export const clientId: string =
  process.env.NODE_ENV === "production"
    ? "687704068939-vd9ps20h587i3tcijhbe9u3la2so4f7d.apps.googleusercontent.com"
    : "911301206062-h9uf3us1dokhn1d0j2ve26ddbq82er3c.apps.googleusercontent.com";
export const redirectUri: string =
  process.env.NODE_ENV === "production"
    ? "https://curly-space-dollop-p9w4vv6547ph6pgr-8080.app.github.dev/oauth2/callback/google"
    : "http://localhost:8080/oauth2/callback/google";
export const responseType: string = "code";
export const scopes: string[] = ["profile", "email"];
