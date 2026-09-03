class Config {
  public NEXT_PUBLIC_API_GATEWAY_URL: string;
  public NEXT_PUBLIC_APP_URL: string;
  public NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;

  constructor() {
    // NOTE: no template literals here — `${undefined}` yields the truthy
    // string "undefined", which would defeat the `|| ""` fallback and break
    // OAuth, API calls and absolute image URLs when an env var is missing.
    this.NEXT_PUBLIC_API_GATEWAY_URL =
      process.env["NEXT_PUBLIC_API_GATEWAY_URL"] || "";
    this.NEXT_PUBLIC_APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "";
    this.NEXT_PUBLIC_GOOGLE_CLIENT_ID =
      process.env["NEXT_PUBLIC_GOOGLE_CLIENT_ID"] || "";
  }
}

export const config: Config = new Config();