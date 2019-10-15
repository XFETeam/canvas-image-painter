# @xfe/canvas-image-painter

> 通过 canvas 合并图片, 文字, 二维码等, 并最终生成一张可分享的独立图片

## 支持
> React
> CommonJs (非 React 亦可)
> ESModule

## 安装

```bash
npm install --save @xfe/canvas-image-painter
```

## 使用

在 React 场景下使用:

```tsx
import * as React from 'react'

import CanvasImagePainter from '@xfe/canvas-image-painter'

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
            rotateDeg: 20, /* 旋转角度 */
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
import CanvasImagePainter from '@xfe/canvas-image-painter'

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

* feat: 

235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
# st-report-sdk
根据黄成龙定制需求, 开发当前工具以实现自定义上报功能。
## 安装
```bash
  npm i @xfe/st-report-sdk -S
```
或直接在页面中引入
```html
  <script src="//zhcdn01.xoyo.com/xassets/lib/st-report-sdk/0.1.3/st-report-sdk.js"></script>
  或者
  <script src="//zhcdn01.xoyo.com/xassets/lib/st-report-sdk/0.1.3/st-report-sdk.min.js"></script>
```
## 常用方式
`st-report-sdk` 被设计成一个 class 实例, 但为了方便绝大多数情况的时候, 内置了静态方法 `static getInstance`: 
```javascript
  window.StReportSdk.getInstance(<项目标识> | <{projectIdentifier, eventTags}>, <是否开启调试模式>);
```
通过该方法我们可以直接获取实例直接进行使用, 通过调用 `report` 方法进行上报, 其中 report 接收一个对象, 该对象用于自定义参数设置:
```javascript
  const stReportSdk = window.StReportSdk.getInstance(<项目标识>, <是否开启调试模式>); 
  stReportSdk.report({eventName: 'click', eventDescription: '点击测试'});
```
用例: 当前项目标识为: 2018_05_03_js3_xoyo_com_tongren, 点击登录并上报:
```javascript
  const stReportSdk = window.StReportSdk.getInstance('2018_05_03_js3_xoyo_com_tongren');
  stReportSdk.report({eventName: 'click', eventDescription: '登录按钮点击'});
```
参考 Demo 源码: [1.basic.html](demo/1.basic.html) (仅限0.0.x版本, 其他版本可供参考)
## 透传当前页面Url参数
根据需求, 默认情况当 url 存在以下列表字段时会拉去下来并同时 report 上报, 这个列表也是API中的qsWhiteList默认值:
```json
[
  'utm_source',
  'utm_medium',
  'utm_term',
  'utm_content',
  'utm_campaign'
]
```
例如当前页面url为 `jx3.xoyo.com?utm_source=666`, **最终 `utm_source` 会始终被作为参数上报**。
## API
public 静态方法:
```javascript
  window.StReportSdk = {
    /**
     * 获取默认实例
     * @param {string} projectIdentifier - 项目唯一标识
     * @param eventTags [string[]] - 事件标签数组（格式与时间分组一致），可选
     * @param {boolean} debug - 是否启用调试模式
     * @param {string} eventGroup - 事件分组（[A-Za-z_\-]+{1,},内部约定），可选
     * @return {StReportSdk} - 返回当前实例
     */
    getInstance({projectIdentifier, eventTags, eventGroup, ...restProps}: any, debug: boolean): StReportSdk;
```
```typescript
  export interface IObject {
      [key: string]: string;
  }
  export interface ILocationObject {
      [key: string]: string;
  }
  export interface IPageViewCache {
      currentUrl: string;
      uid: string;
  }
  export default class StReportSdk {
      private readonly disableGetRequireQsFromUrl;
      private readonly qsWhiteList;
      private readonly apiAddress;
      private readonly projectIdentifier;
      private readonly autoDetectUtmSource;
      private readonly debug;
      private readonly eventTags;
      private readonly eventGroup;
      /**
       * 构造函数
       * @param {boolean} disableGetRequireQsFromUrl - 是否禁止通过 url 拉取所需的 query string 以用于后续上报
       * @param {string[]} qsWhiteList -  query string  白名单
       * @param {string} apiAddress 上报 API 地址
       * @param {string} projectIdentifier 项目标识（[A-Za-z_]+{4,32},内部约定）
       * @param [string[]] eventTags - 事件标签数组（格式与时间分组一致），可选
       * @param {string} eventGroup - 事件分组（[A-Za-z_\-]+{1,},内部约定），可选
       * @param {string} autoDetectUtmSource - 是否自动识别 utm_source, 当 utm_source 为 js false 时才使用
       * @param {boolean} debug 是否启用调试模式
       */
      constructor({disableGetRequireQsFromUrl, qsWhiteList, apiAddress, projectIdentifier, eventTags, eventGroup, autoDetectUtmSource, debug}?: any);
      /**
       * 默认 props
       */
      static defaultProps: {
          qsWhiteList: string[];
          apiAddress: string;
      };
      /**
       * 获取默认实例
       * @param {string} projectIdentifier - 项目唯一标识
       * @param eventTags [string[]] - 事件标签数组（格式与时间分组一致），可选
       * @param {boolean} [debug] - 是否启用调试模式
       * @param {string} [eventGroup] - 事件分组（[A-Za-z_\-]+{1,},内部约定），可选
       * @param {*} [restProps]
       * @return {StReportSdk} - 返回当前实例
       */
      static getInstance({projectIdentifier, eventTags, eventGroup, ...restProps}: any, debug: boolean): StReportSdk;
      /**
       * 单例值, 用于存储 url 和 uid,
       * 请勿直接使用该变量, 请使用 getPageViewId 访问内部值
       * @type {IPageViewCache}
       */
      private static pageViewCache;
      /**
       * 获取 page view id
       * @return {string}
       */
      private static getPageViewId();
      /**
       * 上报
       * @param projectIdentifier [string] - 项目标识（[A-Za-z_]+{4, },内部约定），必选
       * @param eventName [string] - 事件名称，（格式与时间分组一致），可选
       * @param eventGroup [string] - 事件分组（[A-Za-z_\-]+{1,},内部约定），可选
       * @param eventDescription [string]- 事件描述（字符串）
       * @param eventDataValue [object] - 事件额外数据对象，kv对，可选, 如: evd[k1]=v1&evd[k2]
       * @param eventTags [string[]] - 事件标签数组（格式与时间分组一致），可选
       * @param referer {string} - 事件标签数组（格式与时间分组一致），可选
       * @param shouldSendBeacon {boolean} - 是否以 navigator.sendBeacon 的形式发送请求
       */
      report({projectIdentifier, eventName, eventGroup, eventDescription, eventDataValue, eventTags, referer, shouldSendBeacon}?: any): void;
      /**
       * 追踪点击事件。
       * trackClick('ViewProduct');
       * @param eventName {string} - 必选。表示要追踪的事件名。
       * @param properties {object} - 可选。为了保证统一接口，properties可选填，但对于百度统计无效。
       */
      trackClick(eventName: string, properties: object): void;
      /**
       * 页面载入上报共用方法
       * @param extra
       */
      pageLoad(extra?: any): void;
      /**
       * 页面载入上报共用方法
       * @param extra
       */
      pageLeave(extra?: any): void;
      /**
       * 跟踪页面初始化时候上报 用于记录PV
       */
      trackPageLoad(extra?: any): void;
      /**
       * 跟踪页面离开
       */
      trackPageLeave(extra?: any): void;
      /**
       * 当react或vue路由切换页面时上报
       */
      trackRoutePageLoad(extra: any): void;
      /**
       * 计算 route 时间差异
       */
      private static getDiffRouteTime();
      /**
       * 根据当前白名单过滤获取 Location Search Object
       * @return {ILocationObject}
       */
      private getWhiteListLocationSearchObject();
      /**
       * 移除对象中 undefined 的属性
       * @private
       * @param {object} obj - 任意 js 对象
       */
      private static removeObjectUndefinedProps(obj);
      /**
       * 调试log
       * @param {string} message
       * @param {*} extraMessage
       */
      private debugLog(message, extraMessage);
      /**
       * 获取 location.search 中 query string 对象
       * 输入: "?foo=bar"
       * 输出 {foo: 'bar'}
       * @return {ILocationObject}
       */
      private static getLocationSearchObject();
      /**
       * 将请求对象转换
       * @param obj
       * @return {string}
       */
      private static convertObjectToRequestParams(obj);
      /**
       * 判断 navigator.sendBeacon 是否被当前浏览器支持
       */
      private static isSendBeaconSupported();
      /**
       * 通过"图片请求"上报请求
       * @private
       * @param {string} requestUrl
       */
      private static reportRequestViaImage(requestUrl);
      /**
       * 通过"navigator.sendBeacon请求"上报请求
       * @private
       * @param {string} requestUrl
       */
      private static reportRequestViaBeacon(requestUrl);
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
