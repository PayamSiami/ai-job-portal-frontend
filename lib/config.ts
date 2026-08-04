class Config {
  public NEXT_PUBLIC_API_GATEWAY_URL: string | "";
  public NEXT_PUBLIC_APP_URL: string | "";

  constructor() {
    this.NEXT_PUBLIC_API_GATEWAY_URL =
      `${process.env["NEXT_PUBLIC_API_GATEWAY_URL"]}` || "";
    this.NEXT_PUBLIC_APP_URL = `${process.env["NEXT_PUBLIC_APP_URL"]}` || "";
  }
}

export const config: Config = new Config();
