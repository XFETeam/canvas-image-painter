import {ICanvasMember} from './i-canvas-member';
import {ICanvas} from './i-canvas';

export interface ICanvasTextProps extends ICanvasMember {
  /**
   * 文字内容
   */
  text: string;
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
   * 字体颜色
   * 默认: #000
   */
  color?: string;
  /**
   * 字体对齐
   * 默认: left
   */
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  /**
   * 字体大小
   * 默认: 14px
   */
  fontSize?: string;
  /**
   * 字体 family
   */
  fontFamily?: string;
  /**
   * 字体粗细
   * 默认: normal
   */
  fontWeight?: string;
}

export default class CanvasText implements ICanvas {

  private static defaultProps = {
    x: 0,
    y: 0,
    color: '#000',
    textAlign: 'left',
    fontSize: '14px',
    fontFamily: 'Microsoft Yahei',
    fontWeight: 'normal'
  } as ICanvasTextProps;

  public text: string;
  public x: number;
  public y: number;
  public color: string;
  public fontSize: string;
  public fontWeight: string;
  public fontFamily: string;
  public textAlign: ICanvasTextProps['textAlign'];
  public onDraw: ICanvasMember['onDraw'];

  public constructor(props: ICanvasTextProps) {
    Object.assign(this, {...CanvasText.defaultProps}, props);
  }

  public draw(canvasContext: CanvasRenderingContext2D): void {
    if (this.onDraw) {
      this.onDraw(canvasContext, this);
    } else {
      canvasContext.fillStyle = this.color;
      canvasContext.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
      canvasContext.textAlign = this.textAlign as string;
      canvasContext.fillText(this.text, this.x, this.y);
    }
  }

  public prepare(): Promise<ICanvas> {
    return Promise.resolve(this as ICanvas);
  }
}
