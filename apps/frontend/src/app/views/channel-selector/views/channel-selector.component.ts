import { Component, Input, OnInit, inject, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ChannelInfoDTO } from "../../../models/channel-info.dto";
import { ChannelItemComponent } from "../components/channel-item/channel-item.component";
import { ChannelSelectorServiceImpl } from "../services/impl/channel-selector.impl.service";

@Component({
  selector: "app-channel-selector",
  standalone: true,
  imports: [MatProgressSpinnerModule, ChannelItemComponent],
  templateUrl: "./channel-selector.component.html",
  styleUrl: "./channel-selector.component.css",
})
export class ChannelSelectorComponent implements OnInit {
  @Input({ required: true })
  public guildId!: string;

  @Input({ required: true })
  public guildName!: string;

  public channels = signal<ChannelInfoDTO[]>([]);
  public isLoadingChannels = signal<boolean>(false);

  private readonly service = inject(ChannelSelectorServiceImpl);

  public async ngOnInit(): Promise<void> {
    this.isLoadingChannels.set(true);
    const channels = await this.service.getChannels(this.guildId);
    this.channels.set(channels);
    this.isLoadingChannels.set(false);
  }
}
