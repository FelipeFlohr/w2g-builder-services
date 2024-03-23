import { Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { MessengerServiceProvider } from "../providers/messenger-service.provider";
import { MessengerService } from "../services/messenger.service";

@Controller("/messenger")
export class MessengerController {
  private readonly service: MessengerService;

  public constructor(@Inject(MessengerServiceProvider) service: MessengerService) {
    this.service = service;
  }

  @Post("/command")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async setupCommands() {
    await this.service.setupSlashCommands();
  }
}
