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
        this.width = image.naturalWidth;
        this.height = image.naturalHeight;
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
      canvasContext.drawImage(this.imageEl, this.x, this.y, this.width, this.height);
    }
  }

  public prepare(): Promise<ICanvas> {
    return this.onLoad().then(() => this);
  }
}
