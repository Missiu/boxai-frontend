import { shareWorksUsingPost } from '@/services/boxai/postController';
import {
  listMyChartByPageUsingPost,
  updateCodeApiUsingPost,
  updateCodeCataloguePathUsingPost,
  updateCodeCommentUsingPost,
  updateCodeNormStrUsingPost,
  updateCodeProfileUsingPost,
  updateCodeRunUsingPost,
  updateCodeSuggestionUsingPost,
  updateGenNameUsingPost,
} from '@/services/boxai/resultController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Flex,
  FloatButton,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
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
const History: React.FC = () => {
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
  // const [response, setResponse] = useState<API.ChartUpdateRequest>();
  const [visible, setVisible] = useState(false); // 控制输入框的显示与隐藏
  const [description, setDescription] = useState(''); // 存储用户输入的描述
  const items = chartList.map((chart) => ({
    key: String(chart.id),
    label: chart.genName,
  }));

  const handleSubmitGenName = async (newName: string, id: number) => {
    try {
      await updateGenNameUsingPost({ genName: newName, id: id });
      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 genName
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, genName: newName } : chart,
      );

      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('修改成功');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('修改失败');
    }
  };
  // 处理模态框确认按钮点击的函数
  const handleSubmitDescription = async (id: number) => {
    // 在这里实现发布逻辑，如发送描述信息到服务器等
    // 发布成功后关闭模态框并清空输入
    setVisible(false);
    await shareWorksUsingPost({ content: description, id: id });
    message.success('分享成功！');
  };
  // 处理输入框变化的函数
  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };
  const handleSubmitCodeComment = async (str: string, id: number) => {
    try {
      await updateCodeCommentUsingPost({ codeComment: str, id: id });
      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 genName
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeComment: str } : chart,
      );
      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('修改成功');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('修改失败');
    }
  };

  // 更新 CodeNormStr 的异步函数
  const handleSubmitCodeNormStr = async (str: string, id: number) => {
    try {
      await updateCodeNormStrUsingPost({ codeNormStr: str, id: id });
      // 更新状态以局部刷新界面
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeNormStr: str } : chart,
      );
      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeNormStr 修改成功');
    } catch (error) {
      console.error('Error updating CodeNormStr:', error);
      message.error('CodeNormStr 修改失败');
    }
  };

  // 更新 CodeProfile 的异步函数
  const handleSubmitCodeProfile = async (str: string, id: number) => {
    try {
      await updateCodeProfileUsingPost({ codeProfile: str, id: id });
      // 更新状态以局部刷新界面
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeProfile: str } : chart,
      );
      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeProfile 修改成功');
    } catch (error) {
      console.error('Error updating CodeProfile:', error);
      message.error('CodeProfile 修改失败');
    }
  };
  // 更新 CodeAPI 的异步函数
  const handleSubmitCodeAPI = async (str: string, id: number) => {
    try {
      // 调用 API 更新 codeAPI
      await updateCodeApiUsingPost({ codeAPI: str, id: id });

      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 codeAPI
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeAPI: str } : chart,
      );

      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeAPI 修改成功');
    } catch (error) {
      console.error('Error updating CodeAPI:', error);
      message.error('CodeAPI 修改失败');
    }
  };
  // 更新 CodeRun 的异步函数
  const handleSubmitCodeRun = async (str: string, id: number) => {
    try {
      // 假设 updateCodeRunUsingPOST 是一个服务函数，负责发送 POST 请求到后端
      await updateCodeRunUsingPost({ codeRun: str, id: id });

      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 codeRun
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeRun: str } : chart,
      );

      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeRun 修改成功');
    } catch (error) {
      console.error('Error updating CodeRun:', error);
      message.error('CodeRun 修改失败');
    }
  };
  // 更新 CodeSuggestion 的异步函数
  const handleSubmitCodeSuggestion = async (str: string, id: number) => {
    try {
      // 调用 API 更新 codeSuggestion
      await updateCodeSuggestionUsingPost({ codeSuggestion: str, id: id });

      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 codeSuggestion
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeSuggestion: str } : chart,
      );

      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeSuggestion 修改成功');
    } catch (error) {
      console.error('Error updating CodeSuggestion:', error);
      message.error('CodeSuggestion 修改失败');
    }
  };
  // 更新 CodeCataloguePath 的异步函数
  const handleSubmitCodeCataloguePath = async (str: string, id: number) => {
    try {
      // 调用 API 更新 codeCataloguePath
      await updateCodeCataloguePathUsingPost({ codeCataloguePath: str, id: id });

      // 更新状态以局部刷新界面
      // 查找当前列表中对应的图表并更新它的 codeCataloguePath
      const updatedChartList = chartList.map((chart) =>
        chart.id === id ? { ...chart, codeCataloguePath: str } : chart,
      );

      setChartList(updatedChartList); // 更新状态以触发重新渲染
      message.success('CodeCataloguePath 修改成功');
    } catch (error) {
      console.error('Error updating CodeCataloguePath:', error);
      message.error('CodeCataloguePath 修改失败');
    }
  };
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
                <Paragraph
                  style={{ textAlign: 'left' }}
                  editable={{
                    onChange: async (value: string) => {
                      await handleSubmitGenName(value, selectedChart?.id as number);
                    },
                    text: selectedChart.genName,
                    tooltip: '编辑',
                  }}
                >
                  <Text strong>分析名称 : {selectedChart.genName}</Text>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  <Text strong>分析目标 : {selectedChart.goal}</Text>
                </Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>
                  <Text strong>消耗token : {selectedChart.usedToken}</Text>
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeComment(value, selectedChart?.id as number);
                    },
                    text: selectedChart.codeComment,
                    tooltip: '编辑',
                  }}
                >
                  代码解释
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeRun}*/}
                  <Card style={{ backgroundColor: '#fafafa' }}>
                    <Text>
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeProfile(value, selectedChart?.id as number);
                    },
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeCataloguePath(value, selectedChart?.id as number);
                    },
                    text: selectedChart.codeCataloguePath,
                    tooltip: '编辑',
                  }}
                >
                  代码目录
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
            {selectedChart.codeTechnology !== '{}' && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  // editable={{
                  //   // onChange: setCodeCataloguePath,
                  //   text: selectedChart.codeTechnology,
                  //   tooltip: '编辑',
                  // }}
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeRun(value, selectedChart?.id as number);
                    },
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
            {selectedChart.codeEntity !== '{}' && (
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeAPI(value, selectedChart?.id as number);
                    },
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
            {selectedChart.codeNorm !== '{}' && (
              <Typography style={{ textAlign: 'left' }}>
                <Title
                  level={3}
                  editable={{
                    onChange: async (value: string) => {
                      await handleSubmitCodeNormStr(value, selectedChart?.id as number);
                    },
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
                    onChange: async (value: string) => {
                      await handleSubmitCodeSuggestion(value, selectedChart?.id as number);
                    },
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
                <FloatButton onClick={() => setVisible(true)} icon={<UploadOutlined />} />
                {/* 模态框 */}
                <Modal
                  title="分享"
                  open={visible}
                  onOk={() => handleSubmitDescription(selectedChart?.id as number)} // 传递函数，而不是立即调用
                  onCancel={() => setVisible(false)}
                  okText="上传"
                  cancelText="取消"
                >
                  <Form
                    layout="vertical"
                    onFinish={() => handleSubmitDescription(selectedChart?.id as number)}
                  >
                    <Form.Item
                      name="description"
                      label="描述信息"
                      rules={[{ required: true, message: '请输入描述信息!' }]}
                    >
                      <Input.TextArea
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="请输入描述信息"
                        rows={4}
                      />
                    </Form.Item>
                  </Form>
                </Modal>
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

export default History;
