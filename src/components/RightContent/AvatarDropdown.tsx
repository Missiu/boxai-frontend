
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import {userLoginInfo} from "@/services/boxai/userController";

/**
 * GlobalHeaderRight 组件的属性接口
 * @param menu 是否显示菜单，默认为 true
 * @param children 子组件
 */
export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

/**
 * 用于显示用户名的 AvatarName 组件
 */
export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.nickname}</span>;
};

/**
 * 使用样式
 */
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

/**
 * AvatarDropdown 组件，用于实现头像下拉菜单的功能
 * @param menu 是否显示默认的菜单项（个人中心和设置）
 * @param children 子组件
 */
export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  /**
   * 执行退出登录操作，会重定向到登录页
   */
  const loginOut = async () => {
    await userLoginInfo();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /**
     * 如果当前路径不是登录页且没有重定向参数，则跳转到登录页，并带上当前路径
     */
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const { styles } = useStyles();

  // 使用@@initialState模型获取初始状态
  const { initialState, setInitialState } = useModel('@@initialState');

  /**
   * 处理菜单点击事件
   * @param event 菜单项点击事件信息
   */
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  // 加载状态的渲染
  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  // 如果初始状态未加载完，显示加载动画
  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  // 如果当前用户信息不存在，显示加载动画
  if (!currentUser || !currentUser.nickname) {
    return loading;
  }

  // 构造菜单项
  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 渲染菜单
  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
    >
      {children}
    </HeaderDropdown>
  );
};
