import { Component, OnInit, inject, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GuildInfoDTO } from "../../../models/guild-info.dto";
import { GuildItemComponent } from "../components/guild-item/guild-item.component";
import { GuildSelectorService } from "../services/guild-selector.service";
import { GuildSelectorServiceImpl } from "../services/impl/guild-selector.impl.service";

@Component({
  selector: "app-guild-selector",
  standalone: true,
  imports: [MatProgressSpinnerModule, GuildItemComponent],
  templateUrl: "./guild-selector.component.html",
  styleUrl: "./guild-selector.component.css",
})
export class GuildSelectorComponent implements OnInit {
  public isLoadingGuilds = signal<boolean>(false);
  public guilds = signal<Array<GuildInfoDTO>>([]);

  private readonly service: GuildSelectorService = inject(GuildSelectorServiceImpl);

  public async ngOnInit(): Promise<void> {
    this.isLoadingGuilds.set(true);
    const guilds = await this.service.getGuilds();
    this.guilds.set(guilds);
    this.isLoadingGuilds.set(false);
  }
}
