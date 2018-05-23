import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import BasicLayout from './BasicLayout';
import { getMenuData } from '../common/menu';
/**
 * 根据菜单取得重定向地址.
 */

const MenuData = getMenuData();

// 返回所有需要重定向的页面，如果 url 访问的是一级菜单，则重定向到该菜单的第一个二级子菜单，如果有三级子菜单也是类似
const getRedirectData = () => {
  const redirectData = [];
  const getRedirect = item => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          getRedirect(children);
        });
      }
    }
  };
  MenuData.forEach(getRedirect);
  return redirectData;
};

const redirectData = getRedirectData();

class LoadingPage extends PureComponent {
  state = {
    loading: true,
    isMobile: false,
  };
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    // 挂载完成之后，马上获取用户当前状态(此时还处于 loading 状态)
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
    this.hideLoading();
    this.initSetting();
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  hideLoading() {
    this.setState({
      loading: false,
    });
  }
  /**
   * get setting from url params
   */
  initSetting() {
    this.props.dispatch({
      type: 'setting/getSetting',
    });
  }
  render() {
    // 如果还在加载，则返回一个加载页面
    if (this.state.loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    // 如果加载完成，则返回 BasicLayout
    return (
      <BasicLayout
        isMobile={this.state.isMobile}
        menuData={MenuData}
        redirectData={redirectData}
        {...this.props}
      />
    );
  }
}

export default connect()(LoadingPage);
