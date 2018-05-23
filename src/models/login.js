import { routerRedux } from 'dva/router';
import { fakeAccountLogin, login } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import token from '../utils/token';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        // Login successfully
        token.save(response.access_token);
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    // 注意这里有解构出 select 方法
    *logout(_, { put, select }) {
      try {
        // get location pathname
        // {href: "http://localhost:8000/#/dashboard/analysis",
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        // {href: "http://localhost:8000/?redirect=%2Fdashboard%2Fanalysis#/dashboard/analysis"
        urlParams.searchParams.set('redirect', pathname);
        // http://localhost:8000/?redirect=%2Fdashboard%2Fanalysis#/dashboard/analysis,参看：https://developer.mozilla.org/zh-CN/docs/Web/API/History_API
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        // remove token in sessionStorage
        token.remove();
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest', // 注意这里出现了一个新的 guest 的Authority
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
