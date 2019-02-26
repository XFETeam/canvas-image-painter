export interface ICanvas {
  draw(canvasContext: CanvasRenderingContext2D): void;

  prepare(): Promise<ICanvas>;
}
