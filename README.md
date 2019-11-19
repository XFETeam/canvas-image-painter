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

## members 属性

在 React 中 members 作为以数组作为 `CanvasImagePainter` 的 props 属性传入使用,
在非 React 使用中, 则作为 draw 函数 `CanvasImagePainter.draw(<HtmlCanvasElement>, <IMember[]>)` 的第二个参数存在.
基本用法可以参照上述 demo, 更详细用法请参照 [API Interface](##API Interface)

## Typescript API Interface
```ts
export const enum MemberEnum {
  Img = 'img',
  Text = 'text',
  Qr = 'qr'
}

export type IMemberType = CanvasImg | CanvasText | CanvasQr;

export type IMember = {
  type: MemberEnum.Img | MemberEnum.Text | MemberEnum.Qr;
} & IMemberType;

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
   * @deprecated
  foreground?: string;
  /**
   * 容错率
   * 默认: CorrectLevelEnum.M
   */
  correctLevel?: CorrectLevelEnum;
  /**
   * 内边距
   * 默认: 0
   */
  padding: number;
}

export interface ICanvasMember {
  /**
   * 在各自 canvas member 绘制时回调, 用于自定义绘制, 当生效时, 默认绘制行为失效
   * @param canvasContext
   * @param instance
   */
  onDraw?: <T>(canvasContext: CanvasRenderingContext2D, instance: T) => void;
}
```
#### ChangeLog
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
