import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "visualizer-display-control-button",
  standalone: true,
  imports: [],
  templateUrl: "./visualizer-display-control-button.component.html",
  styleUrl: "./visualizer-display-control-button.component.css",
})
export class VisualizerDisplayControlButtonComponent {
  @Input({ required: true })
  public enabled!: boolean;

  @Output()
  public click = new EventEmitter();
}
