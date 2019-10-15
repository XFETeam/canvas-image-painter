import {ICanvasMember} from './i-canvas-member';
import {ICanvas} from './i-canvas';
import CanvasText, {ICanvasTextProps} from './canvas-text';

export interface ICanvasSplicingTextProps extends ICanvasMember {
  /**
   * 拼接字符串的数组
   * 默认：空数组
   */
  textArray: Array<ICanvasTextProps>
  /**
   * 拼接后的字符串x坐标
   */
  x?: number;
  /**
   * 拼接后的字符串y坐标
   */
  y?: number;
}

export default class CanvasSplicingText implements ICanvas{

  private static defaultProps = {
    textArray: [],
    x: 0,
    y: 0
  } as ICanvasSplicingTextProps;

  public textArray: Array<ICanvasTextProps>;
  public onDraw: ICanvasMember['onDraw'];
  public x: number;
  public y: number;

  public constructor(props: ICanvasSplicingTextProps)  {
    Object.assign(this, {...CanvasSplicingText.defaultProps}, props);
  }

  public draw(canvasContext: CanvasRenderingContext2D): void {
    if (this.onDraw) {
      this.onDraw(canvasContext, this);
    } else {
      let xOffset = this.x;
      for (let i = 0; i < this.textArray.length; i ++) {
        let textItem = this.textArray[i];
        textItem.x = xOffset;
        textItem.y = textItem.y || this.y;
        const canvasText = new CanvasText(textItem);
        canvasText.draw(canvasContext);
        xOffset += CanvasSplicingText.measureTextLength(canvasContext, textItem);
      }
    }
  }

  private static measureTextLength(canvasContext: CanvasRenderingContext2D, textItem: ICanvasTextProps): number {
    // canvasContext.save();
    const { text = '', fontSize = '', fontWeight = '', fontFamily = 'sans-serif' } = textItem;
    canvasContext.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const textLength = canvasContext.measureText(text).width;
    // canvasContext.restore();
    return textLength;
  }

  public prepare(): Promise<ICanvas> {
    return Promise.resolve(this as ICanvas);
  }
}
