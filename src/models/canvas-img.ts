import {ICanvasMember} from './i-canvas-member';
import {ICanvas} from './i-canvas';

export interface ICanvasImgProps extends ICanvasMember {
  /**
   * 图片地址
   */
  src: string;
  /**
   * 在 canvas 中 x 轴位置
   * 默认: 0
   */
  x?: number;
  /**
   * 在 canvas 中 y 轴位置
   * 默认: 0
   */
  y?: number;
  /**
   * 绘制在 canvas 时的宽度
   * 默认: 图片 onload 后的宽度
   */
  width?: number;
  /**
   * 绘制在 canvas 时的高度
   * 默认: 图片 onload 后的高度
   */
  height?: number;
  /**
   * 图片的旋转角度
   * 默认： 0
   */
  rotateDeg?: number;
}

export default class CanvasImg implements ICanvas {

  private static defaultProps = {
    x: 0,
    y: 0
  } as ICanvasImgProps;

  public src: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public onDraw: ICanvasMember['onDraw'];
  public imageEl: HTMLImageElement;
  public rotateDeg: number;

  public constructor(props: ICanvasImgProps) {
    Object.assign(this, {...CanvasImg.defaultProps}, props);
  }

  public onLoad() {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = (e: Event) => {
        const image = e.target as any;
        this.imageEl = image;
        this.width = this.width || image.naturalWidth;
        this.height = this.height || image.naturalHeight;
        resolve();
      };
      img.onerror = reject;
      img.src = this.src;
    });
  }

  public draw(canvasContext: CanvasRenderingContext2D): void {
    if (this.onDraw) {
      this.onDraw(canvasContext, this);
    } else {
      if (this.rotateDeg) {
        this.drawRotateImage(canvasContext)
      } else {
        this.drawImage(canvasContext);
      }
    }
  }

  private drawRotateImage(canvasContext: CanvasRenderingContext2D): void {
    canvasContext.save();
    canvasContext.translate(this.x, this.y);
    canvasContext.rotate(-this.rotateDeg * Math.PI / 180);
    canvasContext.drawImage(this.imageEl, 0, 0, this.width, this.height);
    canvasContext.restore();
  }

  private drawImage(canvasContext: CanvasRenderingContext2D) {
    canvasContext.drawImage(this.imageEl, this.x, this.y, this.width, this.height);
  }

  public prepare(): Promise<ICanvas> {
    return this.onLoad().then(() => this);
  }
}
