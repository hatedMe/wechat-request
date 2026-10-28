# wechat-request

<p align="center">
    <img src="https://img.shields.io/npm/dm/wechat-request.svg?style=flat-square" />
    <img src="https://img.shields.io/npm/v/wechat-request.svg?style=flat-square" />
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" />
</p>

> 基于Promise微信小程序http请求，轻便，小巧，api友好，功能丰富

## 特别之处

- 支持Promise API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换为JSON数据
- 超时请求
- 告别callback
- 支持默认请求前缀
- 支持并发请求

## 使用方式

`yarn add wechat-request` <br />
`npm install wechat-request --save `<br />
`pnpm add wechat-request`<br />
`import wxRequest from 'wechat-request';`<br />

## 一步上手

首先来一个简单的`get`请求

```js
// 向具有给定ID的用户发出请求
wxRequest
  .get("/user?id=12345")
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 可选地，上面的请求也可以按照
wxRequest
  .get("/user", {
    params: {
      id: "number",
    },
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 想要使用 async/await？ 将`async`关键字添加到外部函数/method
async function getUser() {
  try {
    const response = await wxRequest.get("/user?ID=12345");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

> 多种方法使用async/waait，开启代码便捷、畅快之旅

接着再来一个`post`请求

```js
wxRequest
  .post("/user", {
    firstname: "firstname",
    lastname: "lastname",
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

执行多并发请求例子

```js
function getUserAccount() {
  return wxRequest.get("/user/12345");
}

function getUserPermissions() {
  return wxRequest.get("/user/12345/permissions");
}

wxRequest.all([getUserAccount(), getUserPermissions()]).then((response) => {
  // dosoming ...
});
```

## 请求方法别名

当然除了常见的`get`,`post`其他的请求也统一封装

- `wxRequest.request(config)`
- `wxRequest.get(url[, config])`
- `wxRequest.delete(url[, config])`
- `wxRequest.head(url[, config])`
- `wxRequest.options(url[, config])`
- `wxRequest.post(url[, data[, config]])`
- `wxRequest.put(url[, data[, config]])`
- `wxRequest.patch(url[, data[, config]])`

> note: 当使用别名方法`url`时，`method`和`data`属性不需要在config中指定。

### 全局配置

使用场景用户请求需要token,或者地址前缀，一次配置，省时省心。

```js
wxRequest.defaults.baseURL = "https://api.example.com";
wxRequest.defaults.headers["Authorization"] = AUTH_TOKEN;
wxRequest.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
```

## TypeScript 用法

全库已迁移为 TypeScript，响应数据默认泛型为 `unknown`，调用时显式声明类型：

```ts
import wxRequest, { isCancel, CanceledError } from "wechat-request";
import type { RequestConfig, Response } from "wechat-request";

interface User {
  id: number;
  name: string;
}

// 泛型声明响应数据类型
const res = await wxRequest.get<User>("/user", { params: { id: 12345 } });
console.log(res.data.name);

// POST 携带请求体类型
await wxRequest.post<User, { firstname: string }>("/user", { firstname: "atom" });

// 新建独立实例（与全局实例隔离配置）
const api = wxRequest.create({ baseURL: "https://api.example.com", timeout: 5000 });

// 类型化拦截器
api.interceptors.request.use((config: RequestConfig) => {
  config.headers = { ...(config.headers ?? {}), Authorization: AUTH_TOKEN };
  return config;
});

// 状态码校验 + 响应转换
const strict = wxRequest.create({
  validateStatus: (status) => status >= 200 && status < 300,
  transformResponse: (data) => data,
});

// AbortController 取消请求
const controller = new AbortController();
try {
  await wxRequest.get("/slow", { signal: controller.signal });
} catch (err) {
  if (isCancel(err) || err instanceof CanceledError) {
    console.log("请求已取消");
  }
}

// 表单别名（自动设置 multipart/form-data 请求头）
await wxRequest.postForm("/upload", { name: "a" });
```

> 说明：`wxRequest.all` / `wxRequest.spread` 作为兼容 API 保留，新代码建议直接使用 `Promise.all`。

## 本地开发

```bash
pnpm install     # 安装依赖
pnpm test        # 运行 Vitest 用例
pnpm typecheck   # tsc --noEmit 类型检查
pnpm build       # 构建 dist/index.js（UMD/CJS）+ dist/index.mjs（ESM）+ 根目录 index.d.ts
```

> 运行时仍使用微信小程序 `wx.request`，未切换平台；构建产物保持 `main: dist/index.js` / `types: index.d.ts` 不变。CommonJS `const wxRequest = require('wechat-request')` 直接得到请求实例（另挂载 `isCancel/isAxiosError/CanceledError`），与旧版一致；ESM 既可用默认导入，也可用命名导入。

## 致谢 && 参考

- [axios](https://github.com/axios/axios)

## License

MIT
