import {ICanvas} from './i-canvas';
import {ICanvasMember} from './i-canvas-member';
import QRCode from 'qrious';

export const enum CorrectLevelEnum {
  M = 'M',
  L = 'L',
  Q = 'Q',
  H = 'H'
}

export interface ICanvasQrProps extends ICanvasMember {
  /**
   * 二维码内容
   * 如: http://jindo.dev.naver.com/collie
   */
  text: string;
  /**
   * 二维码宽高
   * 默认: 256
   */
  size?: number;
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
   * 二维码浅色部分, 背景
   * 默认: "white"
   */
  background?: string;
  /**
   * 前景色, 二维码绘制颜色部分
   * 默认: "black"
   */
  foreground?: string;
  /**
   * 容错率
   * 默认: CorrectLevelEnum.M
   */
  correctLevel?: CorrectLevelEnum;
  /**
   * 内边距
   * 默认: 0
   * @deprecated
   */
  padding: number;
}

export default class CanvasQr implements ICanvas {

  private static defaultProps = {
    size: 256,
    x: 0,
    y: 0,
    correctLevel: CorrectLevelEnum.M,
    background: '#fff',
    foreground: '#000'
  } as ICanvasQrProps;

  public x: number;
  public y: number;
  public text: string;
  public size: number;
  public background: string;
  public foreground: string;
  public correctLevel: CorrectLevelEnum;
  public padding: number;
  public onDraw: ICanvasMember['onDraw'];

  public qrCanvasEl: HTMLCanvasElement;

  public constructor(props: ICanvasQrProps) {
    Object.assign(this, {...CanvasQr.defaultProps}, props);
  }

  public draw(canvasContext: CanvasRenderingContext2D): void {
    if (this.onDraw) {
      this.onDraw(canvasContext, this);
    } else {
      canvasContext.drawImage(this.qrCanvasEl, this.x, this.y, this.size, this.size);
    }
  }

  public prepare(): Promise<CanvasQr> {
    const qr = new QRCode({
      element: document.createElement('canvas'),
      value: this.text,
      size: this.size,
      background: this.background,
      foreground: this.foreground,
      level: this.correctLevel,
      // padding: this.padding
    });
    this.qrCanvasEl = qr.canvas;
    return Promise.resolve(this);
  }
}
