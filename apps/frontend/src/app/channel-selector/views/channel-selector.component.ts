import { Component, Input } from "@angular/core";
import { GuildInfoDTO } from "../../../models/guild-info.dto";

@Component({
  selector: "app-channel-selector",
  standalone: true,
  imports: [],
  templateUrl: "./channel-selector.component.html",
  styleUrl: "./channel-selector.component.css",
})
export class ChannelSelectorComponent {
  @Input({ required: true })
  public guildInfo!: GuildInfoDTO;
}
