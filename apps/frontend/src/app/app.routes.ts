import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/guildselector",
    pathMatch: "full",
  },
  {
    path: "guildselector",
    loadComponent: async () => (await import("./guild-selector/views/guild-selector.component")).GuildSelectorComponent,
  },
  {
    path: "channelselector",
    loadComponent: async () =>
      (await import("./channel-selector/views/channel-selector.component")).ChannelSelectorComponent,
  },
];
