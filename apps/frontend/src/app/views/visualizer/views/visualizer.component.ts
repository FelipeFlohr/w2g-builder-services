import { Component, Input, OnInit, inject } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { VideoReferenceDTO } from "../../../models/video-reference.dto";
import { VisualizerDisplayComponent } from "../components/visualizer-display/visualizer-display.component";
import { VisualizerServiceImpl } from "../services/impl/visualizer.impl.service";
import { VisualizerService } from "../services/visualizer.service";

@Component({
  selector: "app-visualizer",
  standalone: true,
  imports: [MatProgressSpinnerModule, VisualizerDisplayComponent],
  templateUrl: "./visualizer.component.html",
  styleUrl: "./visualizer.component.css",
})
export class VisualizerComponent implements OnInit {
  @Input({ required: true })
  public channelId!: string;

  @Input({ required: true })
  public channelName!: string;

  @Input({ required: true })
  public guildId!: string;

  @Input({ required: true })
  public guildName!: string;

  public fetchedVideos?: Array<VideoReferenceDTO>;
  public index?: number;

  private readonly service: VisualizerService = inject(VisualizerServiceImpl);

  public async ngOnInit(): Promise<void> {
    if (!this.isVideosFetched()) {
      this.fetchedVideos = await this.service.getVideoReferences(this.guildId, this.channelId);
      this.index = 0;
    }
  }

  public isVideosFetched(): boolean {
    return this.fetchedVideos != undefined && this.index != undefined;
  }
}
