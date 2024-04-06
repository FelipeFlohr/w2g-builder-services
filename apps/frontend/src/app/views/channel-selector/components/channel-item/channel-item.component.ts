import { Component, Input } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { RoutesEnum } from "../../../../enums/routes.enum";
import { ChannelInfoDTO } from "../../../../models/channel-info.dto";
import { ChannelItemVisualizerRedirectType } from "../../types/channel-item-visualizer-redirect.type";

@Component({
  selector: "channel-item",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: "./channel-item.component.html",
  styleUrl: "./channel-item.component.css",
})
export class ChannelItemComponent {
  @Input({ required: true })
  public channelInfo!: ChannelInfoDTO;

  @Input({ required: true })
  public guildId!: string;

  @Input({ required: true })
  public guildName!: string;

  public readonly VISUALIZER_REDIRECT_URL = `/${RoutesEnum.VISUALIZER}`;

  public getVisualizerRedirectObject(): ChannelItemVisualizerRedirectType {
    return {
      channelId: this.channelInfo.id,
      channelName: this.channelInfo.name,
      guildId: this.guildId,
      guildName: this.guildName,
    };
  }
}
