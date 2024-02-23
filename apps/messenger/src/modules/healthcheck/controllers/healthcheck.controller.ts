import { Controller, Get, HttpCode } from "@nestjs/common";

@Controller("healthcheck")
export class HealthcheckController {
  @Get()
  @HttpCode(204)
  public health(): void {
    return;
  }
}
