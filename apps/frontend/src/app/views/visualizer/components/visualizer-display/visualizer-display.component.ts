import { Component, Input, OnInit, WritableSignal, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VideoMetadataDTO } from "../../../../models/video-metadata.dto";
import { VideoReferenceDTO } from "../../../../models/video-reference.dto";
import { FileStorageHttpService } from "../../../../services/file-storage-http.service";
import { VisualizerServiceImpl } from "../../services/impl/visualizer.impl.service";
import { VisualizerService } from "../../services/visualizer.service";
import { VisualizerDisplayControlButtonComponent } from "../visualizer-display-control-button/visualizer-display-control-button.component";
import { VisualizerPlayerComponent } from "../visualizer-player/visualizer-player.component";

@Component({
  selector: "visualizer-display",
  standalone: true,
  imports: [MatProgressSpinnerModule, VisualizerDisplayControlButtonComponent, VisualizerPlayerComponent, FormsModule],
  templateUrl: "./visualizer-display.component.html",
  styleUrl: "./visualizer-display.component.css",
})
export class VisualizerDisplayComponent implements OnInit {
  @Input({ required: true })
  public fetchedVideos!: Array<VideoReferenceDTO>;

  @Input({ required: true })
  public index!: number;

  public isLoadingMetadata = signal<boolean>(false);
  public isLoadingVideo = signal<boolean>(false);
  public metadata: WritableSignal<VideoMetadataDTO | undefined> = signal(undefined);
  public videoBuffer: WritableSignal<ArrayBuffer | undefined> = signal(undefined);
  public goToIndex = signal("");

  private readonly service: VisualizerService = inject(VisualizerServiceImpl);
  private readonly fileStorageService: FileStorageHttpService = inject(FileStorageHttpService);

  public constructor(private _snackBar: MatSnackBar) {}

  public async ngOnInit(): Promise<void> {
    await this.setupVideoLoad();
  }

  public canGoBack(): boolean {
    return !this.isLoadingVideo() && this.index - 1 >= 0;
  }

  public canGoForward(): boolean {
    return !this.isLoadingVideo() && this.index + 1 < this.fetchedVideos.length;
  }

  public goBack(): void {
    this.index -= 1;
    this.setupVideoLoad();
  }

  public goForward(): void {
    this.index += 1;
    this.setupVideoLoad();
  }

  public getVideo(): VideoReferenceDTO {
    return this.getVideosWithUrl()[this.index];
  }

  public jumpToIndex() {
    const index = parseInt(this.goToIndex());
    if (!isNaN(index)) {
      const validIndex = index < this.fetchedVideos.length && index >= 0;
      if (validIndex) {
        this.index = index - 1;
        this.setupVideoLoad();
      }
    }
  }

  public getVideosWithUrl(): Array<VideoReferenceDTO> {
    return this.fetchedVideos.filter((v) => v.messageUrlContent != undefined);
  }

  private async setupVideoLoad(): Promise<void> {
    await Promise.all([this.loadVideoMetadata(), this.loadVideoReference()]);
  }

  private async loadVideoMetadata(): Promise<void> {
    this.isLoadingMetadata.set(true);
    this.metadata.set(undefined);

    const video = this.getVideosWithUrl()[this.index];
    const url = video.messageUrlContent?.trim();

    if (url != undefined && url != "") {
      const metadata = await this.service.getVideoMetadata(url);
      if (metadata != undefined) this.metadata.set(metadata);
    }
    this.isLoadingMetadata.set(false);
  }

  private async loadVideoReference(): Promise<void> {
    this.isLoadingVideo.set(true);
    const video = this.getVideo();

    if (video.fileStorageHashId) {
      try {
        const buffer = await this.fileStorageService.getFileAsArrayBuffer(video.fileStorageHashId);
        this.videoBuffer.set(buffer);
      } catch (e) {
        console.error(e);
        if (e instanceof TypeError) {
          this._snackBar.open(`An error was thrown when trying to fetch the video.`, "Close");
        }
      }
    }

    this.isLoadingVideo.set(false);
  }
}
