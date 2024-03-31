import { HttpClientModule } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, withComponentInputBinding, withRouterConfig } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({ paramsInheritanceStrategy: "always" })),
    importProvidersFrom(HttpClientModule),
    provideAnimationsAsync(),
  ],
};
