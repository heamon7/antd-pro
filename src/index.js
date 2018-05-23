import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

import { routerRedux } from 'dva/router';
import { notification } from 'antd';

import createHistory from 'history/createHashHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
// 创建应用，返回 dva 实例
/*
app = dva(opts)
创建应用，返回 dva 实例。(注：dva 支持多实例)

opts 包含：

history：指定给路由用的 history，默认是 hashHistory
initialState：指定初始数据，优先级高于 model 中的 state，默认是 {}
 */
const app = dva({
  history: createHistory(),
  onError(err, dispatch) {
    const { response, message } = err;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: message,
    });
    if (status === 401) {
      dispatch(routerRedux.push('/user/login'));
    }
  },
});

// 2. Plugins
// 配置 hooks 或者注册插件。（插件最终返回的是 hooks ）
// hooks 包含：onError, onAction, onStateChange, onReducer, onEffect, onHmr,extraReducers, extraEnhancers,
app.use(createLoading());

// 3. Register global model
// 注册 model,model 是 dva 中最重要的概念。
app.model(require('./models/global').default);

// 4. Router
// 注册路由表。
app.router(require('./router').default);

// 5. Start
// 启动应用。selector 可选，如果没有 selector 参数，会返回一个返回 JSX 元素的函数。
app.start('#root');

export default app._store; // eslint-disable-line
