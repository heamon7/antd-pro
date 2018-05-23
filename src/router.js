import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

// 这里的 history 来自 dva 的 opts
function RouterConfig({ history, app }) {
  // 返回拍平之后的路由数据字典，key 为 path，value 的 key 包括：name, (icon), path, component, authority, hideInBreadcrumb
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  // 目前是 LoadingPage
  const BasicLayout = routerData['/'].component;
  return (
    // 关于 ConnectedRouter 和 Switch 参考：https://zhuanlan.zhihu.com/p/27433116
    //ConnectedRouter 目的是让 router 和 Redux 联合，routing信息在Redux Store里也存一份
    // Switch，代表只渲染子组件Route中第一个匹配的Route，不用Switch的话，NotFound对应的Route也会每次都渲染，那可不是我们想要的。
    // 关于 AuthorizedRoute 请参考 https://pro.ant.design/components/Authorized-cn/#Authorized.AuthorizedRoute
    // AuthorizedRoute 中 authority和redirectPath是来自 pro 的，其他参数和方法来自 react-router：https://reacttraining.com/react-router/web/api/Route
    // Route 中一般使用 component，而 AuthorizedRoute 中一般使用 render：https://juejin.im/post/5995a2506fb9a0249975a1a4，https://segmentfault.com/a/1190000010174260，https://github.com/ReactTraining/react-router/issues/4526
    // 这里 <Route path="/user" component={UserLayout} /> 有问题，说明访问 /user 页面是不需要鉴权的，如果用户已经登录的话，仍然可以再登录一次，有 bug，这里需要判断，如果已经登录，则重定向到首页
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
