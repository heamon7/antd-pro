routerData = JSON.parse(
  '{"/":{},"/dashboard/analysis":{"name":"分析页"},"/dashboard/monitor":{"name":"监控页"},"/dashboard/workplace":{"name":"工作台"},"/form/basic-form":{"name":"基础表单"},"/form/step-form":{"name":"分步表单"},"/form/step-form/info":{"name":"分步表单（填写转账信息）"},"/form/step-form/confirm":{"name":"分步表单（确认转账信息）"},"/form/step-form/result":{"name":"分步表单（完成）"},"/form/advanced-form":{"name":"高级表单","authority":"admin"},"/list/table-list":{"name":"查询表格"},"/list/basic-list":{"name":"标准列表"},"/list/card-list":{"name":"卡片列表"},"/list/search":{"name":"搜索列表"},"/list/search/projects":{"name":"搜索列表（项目）"},"/list/search/applications":{"name":"搜索列表（应用）"},"/list/search/articles":{"name":"搜索列表（文章）"},"/profile/basic":{"name":"基础详情页"},"/profile/advanced":{"name":"高级详情页","authority":"admin"},"/result/success":{"name":"成功"},"/result/fail":{"name":"失败"},"/exception/403":{"name":"403"},"/exception/404":{"name":"404"},"/exception/500":{"name":"500"},"/exception/trigger":{"name":"触发异常"},"/user":{"name":"账户","authority":"guest"},"/user/login":{"name":"登录","authority":"guest"},"/user/register":{"name":"注册","authority":"guest"},"/user/register-result":{"name":"注册结果","authority":"guest"},"/account/center":{"name":"个人中心"},"/account/center/articles":{},"/account/center/applications":{},"/account/center/projects":{},"/account/settings":{"name":"个人设置"},"/account/settings/base":{},"/account/settings/security":{},"/account/settings/binding":{},"/account/settings/notification":{}}'
);

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

export function getRoutes(path, routerData) {
  // 过滤routerData.keys 中那些和 path 不同，但包含 path 的 keys
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

path = '/user';
res = getRoutes(path, routerData);
res => [
  { exact: true, name: '登录', authority: 'guest', key: '/user/login', path: '/user/login' },
  { exact: true, name: '注册', authority: 'guest', key: '/user/register', path: '/user/register' },
  {
    exact: true,
    name: '注册结果',
    authority: 'guest',
    key: '/user/register-result',
    path: '/user/register-result',
  },
];
path = '/';
res = getRoutes(path, routerData);
res => [
  { exact: true, name: '分析页', key: '/dashboard/analysis', path: '/dashboard/analysis' },
  { exact: true, name: '监控页', key: '/dashboard/monitor', path: '/dashboard/monitor' },
  { exact: true, name: '工作台', key: '/dashboard/workplace', path: '/dashboard/workplace' },
  { exact: true, name: '基础表单', key: '/form/basic-form', path: '/form/basic-form' },
  { exact: false, name: '分步表单', key: '/form/step-form', path: '/form/step-form' },
  {
    exact: true,
    name: '高级表单',
    authority: 'admin',
    key: '/form/advanced-form',
    path: '/form/advanced-form',
  },
  { exact: true, name: '查询表格', key: '/list/table-list', path: '/list/table-list' },
  { exact: true, name: '标准列表', key: '/list/basic-list', path: '/list/basic-list' },
  { exact: true, name: '卡片列表', key: '/list/card-list', path: '/list/card-list' },
  { exact: false, name: '搜索列表', key: '/list/search', path: '/list/search' },
  { exact: true, name: '基础详情页', key: '/profile/basic', path: '/profile/basic' },
  {
    exact: true,
    name: '高级详情页',
    authority: 'admin',
    key: '/profile/advanced',
    path: '/profile/advanced',
  },
  { exact: true, name: '成功', key: '/result/success', path: '/result/success' },
  { exact: true, name: '失败', key: '/result/fail', path: '/result/fail' },
  { exact: true, name: '403', key: '/exception/403', path: '/exception/403' },
  { exact: true, name: '404', key: '/exception/404', path: '/exception/404' },
  { exact: true, name: '500', key: '/exception/500', path: '/exception/500' },
  { exact: true, name: '触发异常', key: '/exception/trigger', path: '/exception/trigger' },
  { exact: false, name: '账户', authority: 'guest', key: '/user', path: '/user' },
  { exact: false, name: '个人中心', key: '/account/center', path: '/account/center' },
  { exact: false, name: '个人设置', key: '/account/settings', path: '/account/settings' },
];
