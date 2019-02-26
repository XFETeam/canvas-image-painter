import * as React from 'react'
import {RefObject} from 'react'
import CanvasImg from './models/canvas-img';
import CanvasText from './models/canvas-text';
import {ICanvas} from './models/i-canvas';
import './styles.css';
import CanvasQr from './models/canvas-qr';

export const enum MemberEnum {
  Img = 'img',
  Text = 'text',
  Qr = 'qr'
}

export const enum CanvasImagePainterType {
  Canvas = 'canvas',
  Image = 'image'
}

export type IMemberType = CanvasImg | CanvasText | CanvasQr;

export type IMember = {
  type: MemberEnum.Img | MemberEnum.Text | MemberEnum.Qr;
} & IMemberType;

export const enum ToDataURLTypeEnum {
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Webp = 'image/webp',
  Gif = 'image/gif'
}

export type IProps = {
  /**
   * 画布(canvas)/图片(canvas) 宽度
   */
  width: number;
  /**
   * 画布(canvas)/图片(canvas) 高度
   */
  height: number;
  /**
   * 画布成员,
   * 类型: IMember[]
   */
  members: IMember[];
  /**
   * canvas 将要绘制回调
   */
  canvasWillDraw?: () => void;
  /**
   * canvas 成功绘制回调
   * 成功回调时, 会携带一个包含 cost 的对象
   * cost: 生成所花费时长, 单位: ms
   */
  canvasDidDrawSuccess?: ({cost}: { cost: number }) => void;
  /**
   * canvas 异常绘制回调
   */
  canvasDidDrawError?: () => void;
  /**
   * 最终生成类型,
   * 类型: CanvasImagePainterType
   * 默认: CanvasImagePainterType.Image, 即图片
   */
  type?: CanvasImagePainterType;
  /**
   * 图片 alt 说明, 仅在 type === CanvasImagePainterType.Image, 即图片时生效
   */
  alt?: string;
  /**
   * className, 可用于修改画布(canvas)/图片(canvas)的css样式
   */
  className?: string;
  /**
   * 转换成图片 base64 时的类型, 如 jpg, png 等, 仅在 type === CanvasImagePainterType.Image, 即图片时生效
   * 推荐使用 image/jpeg, 根据业务总结针对大多数情况下使用 jpeg, 这样生成的 base64 远小于使用 png 生成
   * @///<reference path="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL"/>
   * 默认: ToDataURLTypeEnum.Jpeg
   */
  toDataURLType?: ToDataURLTypeEnum | string;
}

export type IState = {
  src: string;
}

const ns = 'canvas-image-painter';

export default class CanvasImagePainter extends React.PureComponent<IProps, IState> {

  public static defaultProps = {
    type: CanvasImagePainterType.Image,
    toDataURLType: ToDataURLTypeEnum.Jpeg
  };

  public state: IState = {
    src: ''
  };

  public static draw(canvas: HTMLCanvasElement | string | null, members: IProps['members'], shouldConvertToBase64?: boolean, toDataURLType?: IProps['toDataURLType']): Promise<string | null> {
    if (typeof canvas === 'string') {
      canvas = document.querySelector('canvas');
    }
    if (!canvas) {
      throw new Error('target canvas does not exist');
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    /**
     * 针对 query canvas 的场景
     */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return CanvasImagePainter.prepare(members).then((members) => {
      members.forEach((member: ICanvas) => member.draw(ctx));
    }).then(() => {
      if (shouldConvertToBase64) {
        return (canvas as HTMLCanvasElement).toDataURL(toDataURLType);
      }
      return null;
    });
  }

  /**
   * 准备工作
   */
  private static prepare(members: IProps['members']) {
    return Promise.all(members.map(member => {
      let instance: ICanvas;
      switch (member.type) {
        case MemberEnum.Text: {
          instance = new CanvasText(member as CanvasText);
          break;
        }
        case MemberEnum.Img: {
          instance = new CanvasImg(member as CanvasImg);
          break;
        }
        case MemberEnum.Qr: {
          instance = new CanvasQr(member as CanvasQr);
          break;
        }
        default:
          throw new Error(`invalid member type = ${member.type}`);
      }
      return instance.prepare();
    }));
  }

  private readonly $root: RefObject<HTMLCanvasElement>;

  public constructor(props: IProps) {
    super(props);
    this.$root = React.createRef();
  }

  public componentDidMount() {
    return this.startDrawing();
  }

  private startDrawing(props = this.props) {
    const {canvasWillDraw, canvasDidDrawSuccess, canvasDidDrawError} = props;
    canvasWillDraw && canvasWillDraw();
    const promise = this.draw(props);
    const startTime = +new Date();
    promise
      .then(base64 => base64 && this.setState({src: base64}))
      .then(() => {
        const endTime = +new Date();
        canvasDidDrawSuccess && canvasDidDrawSuccess({cost: endTime - startTime});
      })
      .catch(canvasDidDrawError);
    return promise;
  }

  public componentWillReceiveProps(nextProps: Readonly<IProps>): void {
    if (this.props !== nextProps) {
      // noinspection JSIgnoredPromiseFromCall
      this.startDrawing(nextProps);
    }
  }

  private draw(props = this.props) {
    const canvas = this.$root.current as HTMLCanvasElement;
    const {members, toDataURLType} = props;
    const shouldConvertToBase64 = this.isImageType();
    return CanvasImagePainter.draw(canvas, members, shouldConvertToBase64, toDataURLType);
  }

  private static throwUnknownType(type?: CanvasImagePainterType) {
    throw new Error(`unknown canvas image painter type = ${type}`);
  }

  isImageType() {
    const {type} = this.props;
    const isImageType = type === CanvasImagePainterType.Image;
    if (!isImageType && type !== CanvasImagePainterType.Canvas) {
      throw new Error(`unknown canvas image painter type = ${type}`);
    }
    return isImageType;
  }

  /**
   * 获取 className
   * @param className
   */
  private static getFinalClassName(className?: string) {
    if (className) {
      return `${ns} ${className}`;
    } else {
      return ns;
    }
  }

  render() {
    const {width, height, className, type, alt} = this.props;
    const finalClassName = CanvasImagePainter.getFinalClassName(className);
    const {src} = this.state;
    if (this.isImageType()) {
      return (
        <span>
          {src && <img className={finalClassName} src={src} alt={alt} />}
          <canvas ref={this.$root} className={finalClassName} width={width} height={height} style={{display: 'none'}} />
        </span>
      );
    } else if (type === CanvasImagePainterType.Canvas) {
      return <canvas ref={this.$root} className={finalClassName} width={width} height={height} />;
    } else {
      CanvasImagePainter.throwUnknownType(type);
      return null;
    }
  }
}
