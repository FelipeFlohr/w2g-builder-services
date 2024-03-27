import { Component, Input } from "@angular/core";

@Component({
  selector: "guild-item",
  standalone: true,
  imports: [],
  templateUrl: "./guild-item.component.html",
  styleUrl: "./guild-item.component.css",
})
export class GuildItemComponent {
  @Input({ required: true })
  public guildId!: string;

  @Input({ required: true })
  public name!: string;

  @Input({ required: false })
  public url: string | undefined;
}
