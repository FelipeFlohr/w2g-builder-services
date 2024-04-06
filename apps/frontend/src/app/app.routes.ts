import { Routes } from "@angular/router";
import { RoutesEnum } from "./enums/routes.enum";

export const routes: Routes = [
  {
    path: "",
    redirectTo: `/${RoutesEnum.GUILD_SELECTOR}`,
    pathMatch: "full",
  },
  {
    path: RoutesEnum.GUILD_SELECTOR,
    loadComponent: async () =>
      (await import("./views/guild-selector/views/guild-selector.component")).GuildSelectorComponent,
  },
  {
    path: RoutesEnum.CHANNEL_SELECTOR,
    loadComponent: async () =>
      (await import("./views/channel-selector/views/channel-selector.component")).ChannelSelectorComponent,
  },
  {
    path: RoutesEnum.VISUALIZER,
    loadComponent: async () => (await import("./views/visualizer/views/visualizer.component")).VisualizerComponent,
  },
];
