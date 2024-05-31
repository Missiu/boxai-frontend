import React from 'react';
import {Menu} from 'antd';
// 自定义菜单项组件
const CustomMenuItem = ({name, onClick, highlight}) => {
    return (
        <Menu.Item
            style={{
                backgroundColor: highlight ? '#e0ffe0' : 'transparent',
                transition: 'background-color 0.5s',
            }}
            onClick={onClick}
        >
            {name}
        </Menu.Item>
    );
};
export default CustomMenuItem;
