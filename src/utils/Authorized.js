import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

// 注意，这个 Authorized 组件是属于 ant-design-pro 的，并不是 antd 里的
let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};
// ES6：export default 和 export 区别 https://www.jianshu.com/p/edaf43e9384f
export { reloadAuthorized };
export default Authorized;
