import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '';
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Missiu/boxai-backend/',
          blankTarget: true,
        },
        {
          key: 'Box AI',
          title: 'Box AI',
          href: 'https://github.com/Missiu/boxai-backend/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
