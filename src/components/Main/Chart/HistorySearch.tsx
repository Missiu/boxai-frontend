import React from 'react';
import {Layout, Button, Input, Menu} from 'antd';

const {Sider} = Layout;
const {Search} = Input;

interface CustomSiderProps {
    onClick?: (any: string) => void;
    onSearch?: (any: string) => void;
    selectedChartId: [''];
    items: { key: string; label: any; }[] | undefined; // 这里的类型应该根据实际情况调整
}

export const HistorySearch: React.FC<CustomSiderProps> = ({
                                                       onClick,
                                                       onSearch,
                                                       selectedChartId,
                                                       items,
                                                   }) => {
    return (
        <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 24,
                top: '12%',
                bottom: 0,
                borderRadius: '8px',
                backgroundColor: 'white',
            }}
        >
            <div className="demo-logo-vertical"/>

            <Button
                size="large"
                style={{width: '100%', border: 'none', margin: '8px 0'}}
                type="primary"
            >
                历史记录
            </Button>

            <div style={{padding: '12px 0'}}>
                <Search placeholder="搜索" allowClear onSearch={onSearch}/>
            </div>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={selectedChartId}
                onClick={({key}) => onClick?.(key)}
                items={items}
            />
        </Sider>
    );
};

export default HistorySearch;
