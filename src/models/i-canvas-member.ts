export interface ICanvasMember {
  /**
   * 在各自 canvas member 绘制时回调, 用于自定义绘制, 当生效时, 默认绘制行为失效
   * @param canvasContext
   * @param instance
   */
  onDraw?: <T>(canvasContext: CanvasRenderingContext2D, instance: T) => void;
}
