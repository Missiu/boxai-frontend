import {AvatarDropdown, AvatarName, Footer, Question} from '@/components';
import {userLoginInfo} from '@/services/boxai/userController';
import type {ProSettings, Settings as LayoutSettings} from '@ant-design/pro-layout';
import type {RunTimeLayoutConfig} from '@umijs/max';
import {history, RequestConfig} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {errorConfig} from './requestErrorConfig';

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.UserInfoVO;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.UserInfoVO | undefined>;
  chartList?: API.PageChartQueryVO;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await userLoginInfo();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const {location} = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    if (currentUser) {
      return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings as Partial<ProSettings>,
      };
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<ProSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState}) => {
  return {
    actionsRender: () => [<Question key="doc"/>],
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl,
      title: <AvatarName/>,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.nickname,
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  const authHeader = {Token: sessionStorage.getItem('token')};
  return {
    url: `${url}`,
    options: {...options, interceptors: true, headers: authHeader},
  };
};
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  baseURL: 'http://localhost:8101/api/',
  withCredentials: true,
  ...errorConfig,
  requestInterceptors: [authHeaderInterceptor],
};
