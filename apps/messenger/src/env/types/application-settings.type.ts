export type ApplicationSettingsType = {
  readonly port: number;
  readonly name: string;
  readonly env: "development" | "production";
};
