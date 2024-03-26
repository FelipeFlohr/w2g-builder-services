import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: async () => (await import("./guild-selector/views/guild-selector.component")).GuildSelectorComponent,
  },
];
