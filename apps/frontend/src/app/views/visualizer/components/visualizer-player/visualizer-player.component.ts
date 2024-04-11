import { Component, Input, OnChanges, OnDestroy, SimpleChanges, signal } from "@angular/core";

@Component({
  selector: "visualizer-player",
  standalone: true,
  imports: [],
  templateUrl: "./visualizer-player.component.html",
  styleUrl: "./visualizer-player.component.css",
})
export class VisualizerPlayerComponent implements OnChanges, OnDestroy {
  @Input({ required: true })
  public buffer!: ArrayBuffer;

  @Input({ required: true })
  public url!: string;

  public objectUrl = signal("");

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["buffer"]) {
      if (this.objectUrl() != "") {
        URL.revokeObjectURL(this.objectUrl());
      }

      const blob = new Blob([this.buffer]);
      this.objectUrl.set(URL.createObjectURL(blob));
    }
  }

  public ngOnDestroy(): void {
    if (this.objectUrl() != "") {
      URL.revokeObjectURL(this.objectUrl());
    }
  }
}
