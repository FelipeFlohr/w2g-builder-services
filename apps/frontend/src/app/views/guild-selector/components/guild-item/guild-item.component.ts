import { Component, Input } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { RoutesEnum } from "../../../../enums/routes.enum";
import { GuildInfoDTO } from "../../../../models/guild-info.dto";
import { GuildItemChannelRedirectType } from "../../types/guild-item-channel-redirect.type";

@Component({
  selector: "guild-item",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: "./guild-item.component.html",
  styleUrl: "./guild-item.component.css",
})
export class GuildItemComponent {
  @Input({ required: true })
  public guildInfo!: GuildInfoDTO;

  public readonly CHANNEL_SELECTOR_REDIRECT_URL = `/${RoutesEnum.CHANNEL_SELECTOR}`;

  public getChannelRedirectObject(): GuildItemChannelRedirectType {
    return {
      guildId: this.guildInfo.guildId,
      guildName: this.guildInfo.name,
    };
  }
}
