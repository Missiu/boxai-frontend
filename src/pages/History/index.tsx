import { listMyChartByPageUsingPost } from '@/services/boxai/chartController';
import { getLoginUserUsingGet } from '@/services/boxai/userController';
import { Avatar, Card, Divider, List, message } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Chart: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 2,
    // genName: '' // 添加搜索字段的初始值
  };
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [user, setUser] = useState<API.LoginUserResponse>();
  const [total, setTotal] = useState<number>(0);
  const [chartList, setChartList] = useState<API.Chart[]>([]); // 修改初始值为空数组

  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(chartList.length ?? 0); // 设置总数
      } else {
        message.error('获取数据失败' + res.message);
      }
      const mes = await getLoginUserUsingGet();
      setUser(mes?.data); // 设置用户信息
    } catch (e: any) {
      message.error('获取数据失败' + e.message);
    }
  };

  useEffect(() => {
    if (!dataLoaded) {
      loadData().then(() => {
        setDataLoaded(true);
      });
    }
  }, [searchParams, chartList]);

  return (
    <div>
      <div>
        <Search
          placeholder="搜索"
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              genName: value,
            });
          }}
          enterButton
        />
      </div>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        dataSource={chartList}
        footer={<div>历史数据</div>}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={user?.userAvatar} />}
                title={
                  <a href="#">
                    分析目标: {item.goal} <br /> 名称: {item.genName}
                  </a>
                }
                description={<p>原始数据：{item.chatData}</p>}
              />
              <Divider orientation="center">分析结果</Divider>
              <ReactMarkdown>{item.genResult}</ReactMarkdown>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Chart;
