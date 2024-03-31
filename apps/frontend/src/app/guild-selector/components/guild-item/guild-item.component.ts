import { Component, Input } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { GuildInfoDTO } from "../../../../models/guild-info.dto";

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
}
