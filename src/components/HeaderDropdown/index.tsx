/**
 * 使用Ant Design的Dropdown组件实现一个头部下拉菜单。
 * @param {HeaderDropdownProps} props 组件接收的属性。
 * @param {string} [props.overlayClassName] 下拉菜单的样式类名。
 * @param {'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'} [props.placement] 下拉菜单的位置。
 * @returns 返回一个配置了下拉菜单的Dropdown组件。
 */
import { Dropdown } from 'antd';
import { createStyles } from 'antd-style';
import type { DropDownProps } from 'antd/es/dropdown';
import classNames from 'classnames';
import React from 'react';

// 使用antd-style创建样式
const useStyles = createStyles(({ token }) => {
  return {
    dropdown: {
      // 在屏幕宽度小于指定值时，设置下拉菜单宽度为100%
      [`@media screen and (max-width: ${token.screenXS}px)`]: {
        width: '100%',
      },
    },
  };
});

// 定义组件接收的props类型
export type HeaderDropdownProps = {
  overlayClassName?: string; // 下拉菜单项的自定义样式类名
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'; // 下拉菜单的位置
} & Omit<DropDownProps, 'overlay'>; // 除去'overlay'属性外的DropDownProps类型

// 实现HeaderDropdown组件
const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => {
  const { styles } = useStyles(); // 使用定义的样式
  // 返回配置了样式和其它属性的Dropdown组件
  return <Dropdown overlayClassName={classNames(styles.dropdown, cls)} {...restProps} />;
};

export default HeaderDropdown; // 导出组件
