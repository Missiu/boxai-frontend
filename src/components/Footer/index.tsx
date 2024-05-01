/**
 * 自定义页面底部组件
 * 该组件不接受任何参数，并且没有返回值，它会渲染一个简化版的页面底部，
 * 包括一个Github图标链接到项目仓库，以及“Box AI”的文字链接到项目主页。
 */
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  // 默认消息为空
  const defaultMessage = '';
  // 渲染底部组件
  return (
    <DefaultFooter
      style={{
        background: 'none', // 去除背景
      }}
      copyright={`${defaultMessage}`} // 设置版权信息
      links={[
        {
          key: 'github',
          title: <GithubOutlined />, // 使用Github图标作为链接标题
          href: 'https://github.com/Missiu/boxai-backend/',
          blankTarget: true, // 在新标签页打开链接
        },
        {
          key: 'Box AI',
          title: 'Box AI', // 链接标题为"Box AI"
          href: 'https://github.com/Missiu/boxai-backend/',
          blankTarget: true, // 同样在新标签页打开
        },
      ]}
    />
  );
};

export default Footer;
