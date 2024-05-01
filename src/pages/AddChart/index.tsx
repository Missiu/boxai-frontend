import {
  fileAigcUsingPost,
  filesAigcUsingPost,
  listMyChartByPageUsingPost,
} from '@/services/boxai/resultController';
import { getLoginUserUsingGet } from '@/services/boxai/userController';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
  Upload,
  message,
  theme,
} from 'antd';
import Search from 'antd/es/input/Search';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';

const { Content, Footer, Sider } = Layout;
const { Text } = Typography;

const App: React.FC = () => {
  const navigate = useNavigate();
  const initSearchParams = {
    current: 1,
    pageSize: 10,
    // genName: '' // 添加搜索字段的初始值
  };
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  // const [user, setUser] = useState<API.UserInfoResponse>();
  const [total, setTotal] = useState<number>(0);
  const [chartList, setChartList] = useState<API.Result[]>([]); // 修改初始值为空数组
  const [currentFormItem, setCurrentFormItem] = useState<
    'fileUpload' | 'textInput' | 'filesUpload'
  >('filesUpload');
  const [isFileUploadSelected, setIsFileUploadSelected] = useState(false);
  const [isFilesUploadSelected, setIsFilesUploadSelected] = useState(false);
  const [isTextInputSelected, setIsTextInputSelected] = useState(false);
  // 使用useState钩子管理图表数据状态
  // const [file, setFile] = useState<API.ChartFileResponse>();
  // const [files, setFiles] = useState<API.ChartFilesResponse>();
  // const [selectedChartId, setSelectedChartId] = useState<string | null>(null); // 新增状态用于存储选中的图表ID

  // 使用useState钩子管理提交状态，避免重复提交
  const [submitting, setSubmitting] = useState<boolean>(false);

  const updateSelection = (buttonType: string) => {
    switch (buttonType) {
      case 'fileUpload':
        setIsFileUploadSelected(true);
        setIsFilesUploadSelected(false);
        setIsTextInputSelected(false);
        break;
      case 'filesUpload':
        setIsFileUploadSelected(false);
        setIsFilesUploadSelected(true);
        setIsTextInputSelected(false);
        break;
      case 'textInput':
        setIsFileUploadSelected(false);
        setIsFilesUploadSelected(false);
        setIsTextInputSelected(true);
        break;
      default:
        break;
    }
  };

  const items = chartList.map((chart) => ({
    key: String(chart.id), // 假设chart对象有id属性
    label: chart.genName,
  }));
  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0); // 设置总数
        console.log(res.data);
      } else {
        message.error('获取数据失败' + res.message);
      }
      const mes = await getLoginUserUsingGet();
      // setUser(mes?.data); // 设置用户信息
      console.log(mes?.data);
    } catch (e: any) {
      message.error('获取数据失败' + e.message);
    }
  };

  useEffect(() => {
    // 设置默认的表单项为文件上传，并且确保对应的按钮为选中状态
    setCurrentFormItem('fileUpload');
    setIsFileUploadSelected(true);
    // 其他初始化逻辑...
    if (!dataLoaded) {
      loadData().then(() => {
        setDataLoaded(true);
      });
    }
  }, []); // 空依赖数组表示仅在组件挂载时运行一次
  // 添加点击处理函数
  const handleMenuClick = (key: string) => {
    navigate('/history', { state: { id: key } });
    // setSelectedChartId(key); // 更新选中的图表ID
  };
  const upFile = async (values: any) => {
    console.log(values);
    // 如果正在提交中，则直接返回避免重复提交
    if (submitting) {
      return;
    }
    // 设置提交中状态
    setSubmitting(true);
    const params = {
      ...values,
      file: undefined,
    };
    // 如果是单独上传文件，则调用相应的后端接口
    const res = await fileAigcUsingPost(params, {}, values.file.file.originFileObj);
    if (!res?.data) {
      message.error('分析失败');
    }
    console.log(res);
    // setFile(res.data);
    message.success('上传成功');
    setSubmitting(false);
    navigate('/history', { state: { id: chartList.map((chart) => String(chart.id))[total] } });
    console.log(res.data);
  };
  const upFiles = async (values: any) => {
    // 如果正在提交中，则直接返回避免重复提交
    if (submitting) {
      return;
    }
    // 设置提交中状态
    setSubmitting(true);
    // 如果是上传文件夹或其他场景
    const fileList = values.files.fileList;
    const originFileObjs = fileList.map((file: any) => file.originFileObj);
    const p = {
      genName: values.genName,
      goal: values.goal,
      files: originFileObjs,
    };
    // 调用处理多个文件上传的后端接口
    const res = await filesAigcUsingPost(p);
    if (!res?.data) {
      message.error('分析失败');
    }
    // setFiles(res.data);
    message.success('上传成功');
    navigate('/thistory', { state: { id: chartList.map((chart) => String(chart.id))[total] } });
    setSubmitting(false);
  };

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
          top: '10%',
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
          defaultSelectedKeys={['']}
          onClick={({ key }) => handleMenuClick(key)} // 绑定点击事件处理
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Space.Compact block></Space.Compact>
        <Row style={{}}>
          <Col span={8}>
            <Button
              type={isFileUploadSelected ? 'primary' : 'default'}
              size="large"
              style={{ width: '80%', marginLeft: '20%' }}
              onClick={() => {
                updateSelection('fileUpload');
                setCurrentFormItem('fileUpload');
              }}
            >
              单文件上传
            </Button>
          </Col>
          <Col span={8}>
            <Button
              type={isFilesUploadSelected ? 'primary' : 'default'}
              size="large"
              style={{ width: '100%' }}
              onClick={() => {
                updateSelection('filesUpload');
                setCurrentFormItem('filesUpload');
              }}
            >
              多文件上传
            </Button>
          </Col>
          <Col span={8}>
            <Button
              type={isTextInputSelected ? 'primary' : 'default'}
              size="large"
              style={{ width: '80%', marginRight: '20%' }}
              onClick={() => {
                updateSelection('textInput');
                setCurrentFormItem('textInput');
              }}
            >
              输入文本
            </Button>
          </Col>
        </Row>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {currentFormItem === 'fileUpload' && (
              <Form onFinish={upFile}>
                <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <Text strong>分析名称：</Text>
                </Typography>
                <Form.Item style={{ margin: '12px 12px' }}>
                  <Form.Item name="genName">
                    <Input placeholder="输入分析名称" />
                  </Form.Item>
                  <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                    <Text strong>分析目标：</Text>
                  </Typography>
                  <Form.Item name="goal">
                    <Input placeholder="输入分析目标" />
                  </Form.Item>
                  <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                    <Text strong>上传文件：</Text>
                  </Typography>
                  <Form.Item name="file">
                    <Upload.Dragger style={{ padding: '24px' }} name="file" showUploadList={true}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">点击上传文件</p>
                      <p className="ant-upload-hint">
                        在这里可以上传单个文件，支持的文件格式编码为TUF-8
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                  <Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          type="primary"
                          block
                          size="large"
                          htmlType="submit"
                          loading={submitting}
                          disabled={submitting}
                        >
                          提交
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button block size="large" htmlType="reset">
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form.Item>
              </Form>
            )}
            {currentFormItem === 'filesUpload' && (
              <Form onFinish={upFiles}>
                <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <Text strong>分析名称：</Text>
                </Typography>
                <Form.Item style={{ margin: '12px 12px' }}>
                  <Form.Item name="genName">
                    <Input placeholder="输入分析名称" />
                  </Form.Item>
                  <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                    <Text strong>分析目标：</Text>
                  </Typography>
                  <Form.Item name="goal">
                    <Input placeholder="输入分析目标" />
                  </Form.Item>
                  <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                    <Text strong>上传文件：</Text>
                  </Typography>
                  <Form.Item name="files">
                    <Upload.Dragger
                      style={{ padding: '24px' }}
                      name="files"
                      directory={true}
                      showUploadList={true}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">点击上传文件夹</p>
                      <p className="ant-upload-hint">
                        在这里可以上传多个文件，也就是文件，支持的文件格式编码为TUF-8
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                  <Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          type="primary"
                          block
                          size="large"
                          htmlType="submit"
                          loading={submitting}
                          disabled={submitting}
                        >
                          提交
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button block size="large" htmlType="reset">
                          重置
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form.Item>
              </Form>
            )}
            {currentFormItem === 'textInput' && (
              <Form.Item style={{ margin: '12px 12px' }}>
                <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <Text strong>分析名称：</Text>
                </Typography>
                <Form.Item name={'genName'}>
                  <div>
                    <Input placeholder="输入分析名称" />
                  </div>
                </Form.Item>
                <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <Text strong>分析目标：</Text>
                </Typography>
                <Form.Item name={'goal'}>
                  <Input placeholder="输入分析目标" />
                </Form.Item>
                {/* 新增用于输入文本的Form.Item */}
                <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                  <Text strong>输入文本：</Text>
                </Typography>
                <Form.Item name="inputText">
                  <TextArea
                    placeholder="这里可以输入文本，支持markdown语法"
                    autoSize={{ minRows: 6, maxRows: 10 }}
                  ></TextArea>
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Button type="primary" block size="large">
                      提交
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button block size="large">
                      重置
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            )}
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
