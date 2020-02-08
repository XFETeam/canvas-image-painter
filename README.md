# @xfe-team/canvas-image-painter

> 通过 canvas 合并图片, 文字, 二维码等, 并最终生成一张可分享的独立图片

## 支持
> React
> CommonJs (非 React 亦可)
> ESModule

## 安装

```bash
npm install --save @xfe-team/canvas-image-painter
```

## 使用

在 React 场景下使用:

```tsx
import * as React from 'react'

import CanvasImagePainter from '@xfe-team/canvas-image-painter'

class Example extends React.Component {
  render () {
    return (
      <CanvasImagePainter
        width={640}
        height={1236}
        members={[
          {
            type: 'img',
            src: require('./images/1.jpg'),
            x: 0,
            y: 0
          },
          {
            type: 'text',
            text: '艾伦',
            x: 640 / 2,
            y: 300,
            fontSize: '52px',
            color: '#6d6d6f',
            textAlign: 'center'
          },
          {
            type: 'img',
            src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/fyKc7ddeDxEDkFmWEQlTcDlcIWfS8P20TDry8aX9axMfpznsISLPvxBcG1bUznRbcqPsOGhzLPzO3zHP5PcrVQ/132',
            x: 521,
            y: 319,
            width: 142,
            height: 142,
            circleRadius: 71,
            onImgError: function() {
              console.log('无法获取微信头像');
            }
          },
          {
            type: 'img',
            src: require('./images/home-share.jpg'),
            x: 200,
            y: 1000,
            width: 200,
            height: 200, /* 没有宽高默认图片宽高 */
            rotateDeg: 20 /* 旋转角度 */
          },
          {
            type: 'qr',
            text: 'https://www.npmjs.com/package/astring',
            x: 200,
            y: 950,
            size: 140,
            textBaseline: 'top', /* 默认top */
            padding: 30
          }，
          {
            type: 'SplicingText', /* 拼接的文字字符串 */
            x: 100,
            y: 200,
            textArray: [
              {
                type: 'text',
                text: '111',
                fontSize: '35px',
                color: '#bc3326'
              },
              {
                type: 'text',
                text: 'aaaa',
                fontSize: '20px',
                color: 'blue'
              },
              {
                type: 'text',
                text: '222',
                fontSize: '35px',
                color: '#bc3326'
              }
            ]
          }
        ]}
      />
    )
  }
}
```

在非 React 场景下使用:

```ts
import CanvasImagePainter from '@xfe-team/canvas-image-painter'

const canvas = document.getElementById('#canvas');
CanvasImagePainter.draw(canvas, [
  {
    src: require('./images/1.jpg'),
    x: 0,
    y: 0
  },
  {
    type: 'text',
    text: '艾伦',
    x: 640 / 2,
    y: 300,
    fontSize: '52px',
    color: '#6d6d6f',
    textAlign: 'center'
  },
  {
    type: 'img',
    src: require('./images/home-share.jpg'),
    x: 200,
    y: 1000
  },
  {
    type: 'qr',
    text: 'https://www.npmjs.com/package/astring',
    x: 200,
    y: 950,
    size: 140,
    padding: 30
  }
]).then(()=> {
  console.log('completed !')
});
```

## 绘制概念
这里不详细讲述当前工具实现原理, 主要针对如何编写 members 进行讲解.

在第一个 demo 中, 我们定义了画布大小和传入了一系列相关信息

```xml
<CanvasImagePainter
  width={640}
  height={1236}
  members={[
    {
      type: 'img',
      src: require('./images/1.jpg'),
      x: 0,
      y: 0
    },
    {
      type: 'text',
      text: '艾伦',
      x: 640 / 2,
      y: 300,
      fontSize: '52px',
      color: '#6d6d6f',
      textAlign: 'center'
    },
    {
      type: 'img',
      src: require('./images/home-share.jpg'),
      x: 200,
      y: 1000
    },
    {
      type: 'qr',
      text: 'https://www.npmjs.com/package/astring',
      x: 200,
      y: 950,
      size: 140,
      padding: 30
    }
  ]}
/>
```

其中 `width` 和 `height` 是最初定义该画布的宽高,
通常来说我们可以根据设计稿如 750 * 1334 的高度设置画布宽高,
而其他 members 内容如:

```js
{
  type: 'text',
  text: '艾伦',
  x: 640 / 2,
  y: 300,
  fontSize: '52px',
  color: '#6d6d6f',
  textAlign: 'center'
}
```

主要用于类似 css 在 750 宽度中使用绝对定位以及相对750宽高大小放置 `我的名字` 相关信息,
通过这种形式, 我们可以在画布中绘制 `背景图`, 并在该背景图中分别支持绘制 `Text文本`, `Qr 二维码`, `图片` 等.

## CanvasImagePainter Typescript API Interface
```ts
export const enum MemberEnum {
  Img = 'img',
  Text = 'text',
  Qr = 'qr',
  SplicingText = 'SplicingText'
}

export const enum CanvasImagePainterType {
  Canvas = 'canvas',
  Image = 'image'
}

export type IMemberType = CanvasImg | CanvasText | CanvasQr | CanvasSplicingText;

export type IMember = {
  type: MemberEnum.Img | MemberEnum.Text | MemberEnum.Qr | MemberEnum.SplicingText;
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
```

## members 属性

在 React 中 members 作为以数组作为 `CanvasImagePainter` 的 props 属性传入使用,
在非 React 使用中, 则作为 draw 函数 `CanvasImagePainter.draw(<HtmlCanvasElement>, <IMember[]>)` 的第二个参数存在.
基本用法可以参照上述 demo, 更详细用法请参照 [API Interface](##API Interface)

#### 图片元素
```ts
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
  /**
   * 圆形的图片半径
   * 默认： 0
   */
   circleRadius?: number
}
```

#### 二维码元素

```ts
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
```

#### 拼接文本元素

```ts
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
```

#### 文本元素

```ts
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
   * 默认: normal
   */
  fontWeight?: string;
  /**
   * 字体旋转角度
   */
  rotateDeg?: number;
  /**
   * 文字基线
   */
  textBaseline?: string;
}
```

#### ChangeLog
## 0.1.2 (2020-01-15)
* add: 加入圆形图片绘制
* add: 加入绘制图片错误回调

## 0.1.0 (2019-10-15)
* fix: 修复入口文件缺失问题
* fix: 修复无法设置图片大小问题
* add: 加入图片旋转
* add: 加入文字旋转
* add: 加入文字基线 textBaseline
* add: 加入文字拼接功能

## License

She Ailun <br/>
Huang Zhe
