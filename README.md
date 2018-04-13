



# wechat-request

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



## 一步上手

首先来一个简单的```get```请求
```js
// 向具有给定ID的用户发出请求
wxRequest.get('/user?ID=12345')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

// 可选地，上面的请求也可以按照
wxRequest.get('/user', {
    params: {
        ID: 12345
        }
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
        const response = await wxRequest.get('/user?ID=12345');
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
```
> 想要开启 async/waait 畅快之旅，需要 bable2阶段。吼吼

接着再来一个```post```请求

```js
wxRequest.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
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
    return wxRequest.get('/user/12345');
}

function getUserPermissions() {
    return wxRequest.get('/user/12345/permissions');
}

wxRequest.all([getUserAccount(), getUserPermissions()])
    .then(wxRequest.spread(function (acct, perms) {
        // Both requests are now complete
    }));
```

## 请求方法别名
当然除了常见的```get```,```post```其他的请求也统一封装

- ```wxRequest.request(config)```
- ```wxRequest.get(url[, config])```
- ```wxRequest.delete(url[, config])```
- ```wxRequest.head(url[, config])```
- ```wxRequest.options(url[, config])```
- ```wxRequest.post(url[, data[, config]])```
- ```wxRequest.put(url[, data[, config]])```
- ```wxRequest.patch(url[, data[, config]])```

> note 当使用别名方法`url`时，`method`和`data`属性不需要在config中指定。


### 全局配置

使用场景用户请求需要token,或者地址前缀，一次配置，省时省心。

```js
wxRequest.defaults.baseURL = 'https://api.example.com';
wxRequest.defaults.headers.common['Authorization'] = AUTH_TOKEN;
wxRequest.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

## 致谢 && 参考
* [wxRequest](https://github.com/wxRequest/wxRequest)


## License

MIT