import { listMyChartByPageUsingPost } from '@/services/boxai/resultController';
import {
  Button,
  Card,
  Divider,
  Flex,
  Layout,
  Menu,
  Slider,
  Switch,
  Typography,
  message,
  theme,
} from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLocation } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

// 将一些逻辑处理函数移到组件外部
function handleAPIError(error: any) {
  if (error.response) {
    // 请求已发送，但服务器响应的状态码不在2xx范围内
    console.error('Error:', error.response.data);
  } else {
    // 其他错误，例如网络问题
    console.error('Error:', error.message);
  }
}

// 检查图表代码是否正确
function checkChartCode(text: string) {
  return text;
}

function parseCodeNorm(code: string) {
  if (code) {
    try {
      const parsedData = checkChartCode(code);
      if (parsedData) {
        return JSON.parse(parsedData ?? '{}');
      } else {
        return '{}';
      }
    } catch (error) {
      console.error('解析 JSON 字符串时出错:', error);
      return '{}';
    }
  } else {
    return '{}';
  }
}
const App: React.FC = () => {
  const location = useLocation();
  let idType = {} as { id?: string };
  idType = location.state || {};

  const initSearchParams = {
    current: 1,
    pageSize: 10,
    // genName: '' // 添加搜索字段的初始值
  };
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chartList, setChartList] = useState<API.Result[]>([]);
  const [selectedChartId, setSelectedChartId] = useState<string>(
    localStorage.getItem('lastSelectedKey') ?? '',
  ); // 新增状态用于存储选中的图表ID
  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const items = chartList.map((chart) => ({
    key: String(chart.id),
    label: chart.genName,
  }));

  // 添加点击处理函数
  const handleMenuClick = (key: string) => {
    localStorage.setItem('lastSelectedKey', key);
    setSelectedChartId(key); // 更新选中的图表ID
  };
  const renderContent = () => {
    if (selectedChartId) {
      // 根据chartId获取详细的图表数据
      const selectedChart = chartList.find((chart) => String(chart.id) === selectedChartId);
      if (selectedChart) {
        let codeNorm = parseCodeNorm(selectedChart.codeNorm ?? '');
        let codeTechnology = parseCodeNorm(selectedChart.codeTechnology ?? '');
        let codeEntity = parseCodeNorm(selectedChart.codeEntity ?? '');
        return (
          <>
            {/*前言*/}
            <Typography>
              <Card>
                <Paragraph style={{ textAlign: 'left' }}>
                  <Title level={5}>分析名称 : {selectedChart.genName}</Title>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  <Title level={5}>分析目标 : {selectedChart.goal}</Title>
                </Paragraph>
                {/*原始数据部分*/}
                <Paragraph>
                  <Text strong>原始数据</Text>

                  <Flex gap={16} align="center">
                    <Switch
                      checked={expanded}
                      onChange={() => setExpanded((c) => !c)}
                      style={{ flex: 'none' }}
                    />
                    <Slider
                      min={1}
                      max={20}
                      value={rows}
                      onChange={setRows}
                      style={{ flex: 'auto' }}
                    />
                  </Flex>
                  <Paragraph
                    copyable={true}
                    ellipsis={{
                      rows,
                      expandable: 'collapsible',
                      expanded,
                      onExpand: (_, info) => setExpanded(info.expanded),
                    }}
                  >
                    {selectedChart.rawData}
                  </Paragraph>
                </Paragraph>
              </Card>
            </Typography>
            <Divider orientation="center">分析结果如下</Divider>
            {/*代码解释*/}
            {selectedChart.codeComment && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeComment,
                    tooltip: '编辑',
                  }}
                >
                  代码解释
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <Text code={true}>
                      <pre>{selectedChart.codeComment}</pre>
                    </Text>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*项目简介*/}
            {selectedChart.codeProfile && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeProfile,
                    tooltip: '编辑',
                  }}
                >
                  项目简介
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <ReactMarkdown>{selectedChart.codeProfile}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {selectedChart.codeCataloguePath && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeCataloguePath,
                    tooltip: '编辑',
                  }}
                >
                  代码解释
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <Text>
                      <pre>{selectedChart.codeCataloguePath}</pre>
                    </Text>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*项目技术栈*/}
            {codeTechnology !== '{}' && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeTechnology,
                    tooltip: '编辑',
                  }}
                >
                  项目技术栈
                </Title>
                <Paragraph>
                  <Card>
                    {codeTechnology === '{}' ? (
                      <ReactMarkdown>{selectedChart.codeTechnology}</ReactMarkdown>
                    ) : (
                      <ReactECharts option={codeTechnology}></ReactECharts>
                      // <ReactECharts option={selectedChart.codeEntity}></ReactECharts>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*如何运行*/}
            {selectedChart.codeRun && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeRun,
                    tooltip: '编辑',
                  }}
                >
                  如何运行
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <ReactMarkdown>{selectedChart.codeRun}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*实体关系*/}
            {codeEntity !== '{}' && (
              <Typography style={{ textAlign: 'left' }}>
                <Title level={3}>实体关系</Title>
                <Paragraph>
                  <Card>
                    {codeEntity === '{}' ? (
                      <ReactMarkdown>{selectedChart.codeEntity}</ReactMarkdown>
                    ) : (
                      <ReactECharts option={codeEntity}></ReactECharts>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*第三方API*/}
            {selectedChart.codeAPI && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeAPI,
                    tooltip: '编辑',
                  }}
                >
                  第三方API
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <ReactMarkdown>{selectedChart.codeAPI}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*代码规范*/}
            {codeNorm !== '{}' && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeAPI,
                    tooltip: '编辑',
                  }}
                >
                  代码规范
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <ReactMarkdown>{selectedChart.codeNormStr}</ReactMarkdown>
                    {codeNorm === '{}' ? (
                      <ReactMarkdown>{selectedChart.codeNorm}</ReactMarkdown>
                    ) : (
                      <ReactECharts option={codeNorm}></ReactECharts>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}
            {/*优化建议*/}
            {selectedChart.codeSuggestion && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    // onChange: setCodeCataloguePath,
                    text: selectedChart.codeSuggestion,
                    tooltip: '编辑',
                  }}
                >
                  优化建议
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <ReactMarkdown>{selectedChart.codeSuggestion}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}
          </>
        );
      }
    }
    return (
      <Card>
        <Text>暂无数据</Text>
      </Card>
    );
    // 如果没有选中具体的图表或者数据加载中，展示数据第一条
  };

  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost({ ...initSearchParams });
      if (res.data) {
        setChartList(res.data.records ?? []);
      } else {
        message.error('获取数据失败: ' + (res.message ?? '未知错误'));
      }
    } catch (e) {
      handleAPIError(e);
    }
  };
  useEffect(() => {
    if (!dataLoaded) {
      loadData().then(() => {
        setDataLoaded(true);
        if (idType.id) {
          setSelectedChartId(idType.id);
          localStorage.setItem('lastSelectedKey', idType.id);
        }
        // 如果idType.id为空，chartList有数据，但是localStorage中没有lastSelectedKey或者对应的ID不存在，则设置为第一个菜单项
        if (
          idType.id === '' &&
          chartList.length > 0 &&
          (!localStorage.getItem('lastSelectedKey') ||
            !chartList.find(
              (chart) => String(chart.id) === localStorage.getItem('lastSelectedKey'),
            ))
        ) {
          setSelectedChartId(String(chartList[0].id));
        }
      });
    }

    // 页面加载时尝试从localStorage获取上一次选中的菜单项
    const lastSelectedKey = localStorage.getItem('lastSelectedKey');
    if (lastSelectedKey) {
      setSelectedChartId(lastSelectedKey);
    } else if (chartList.length > 0) {
      // 如果没有lastSelectedKey或者对应的ID不存在，则设置为第一个菜单项
      setSelectedChartId(String(chartList[0].id));
    }
  }, [chartList]); // 添加chartList作为依赖项以确保当chartList更新时，这个逻辑会被执行

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout hasSider>
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
        <div className="demo-logo-vertical" />
        <Button
          size="large"
          style={{ width: '100%', border: 'none', margin: '8px 0' }}
          type={'primary'}
        >
          历史记录
        </Button>
        <div style={{ padding: '12px 0' }}>
          <Search placeholder="搜索" allowClear />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={[selectedChartId]}
          onClick={({ key }) => handleMenuClick(key)} // 绑定点击事件处理
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: '8px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
