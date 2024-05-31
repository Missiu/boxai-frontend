import {genFileChart, genMultipleChart, genTextChart, listChartInfo} from '@/services/boxai/dataChartController';
import {InboxOutlined} from '@ant-design/icons';
import {useModel, useNavigate} from '@umijs/max';
import {Button, Col, Form, Input, Layout, Menu, message, Row, Space, theme, Typography, Upload,} from 'antd';
import Search from 'antd/es/input/Search';
import React, {useEffect, useState} from 'react';
import FileUploadForm from '@/components/Main/Chart/FileUploadForm';
import {flushSync} from "react-dom";
import '../History/menu.css'

const {Content, Sider} = Layout;
const {Title} = Typography;


const Chart: React.FC = () => {

  /**
   * 思路导航：
   * 1. 获取用户信息
   * 2. 获取图表信息
   * 3. 菜单处理
   * 4. 搜索框处理
   * 5. 顶部按钮处理
   * 6. 实现单文件分析接口
   * 7. 实现多文件分析接口
   */

  /**
   * 全局参数获取用户信息
   */
  const {initialState, setInitialState} = useModel('@@initialState');

  /**
   * 获取图表信息
   */
    // 分页信息请求
  const [searchParams] = useState<API.PageModel>();
  // 图表列表信息请求
  const [formChartListData, setFormChartListData] = useState<API.ChartQueryDTO>({});
  // 图表分页查询的结果列表
  const [chartPageList, setChartPageList] = useState<API.PageUniversalDataChartsVO>();
  const getChartListData = async () => {
    try {
      // 全局参数里获取用户信息，作为查询参数的一部分
      setFormChartListData({userId: initialState?.currentUser?.id})
      const res = await listChartInfo({pageModel: {...searchParams}}, {...formChartListData});
      if (res.code === 200) {
        setChartPageList(res.data)
        // 同步回调，保存列表参数
        flushSync(() => {
          setInitialState((s: any) => {
            return {
              ...s,
              chartList: res.data
            }
          })
        });
      } else {
        message.error('获取历史数据失败' + res.msg);
      }
    } catch (error) {
      message.error('异常: 获取数据失败');
    }
  };

  /**
   * 菜单处理：页面跳转携带id
   */
    // 获取路由对象
  const navigate = useNavigate();
  // 历史菜单击处理函数
  const handleMenuClick = (key: string) => {
    // 将key作为状态传递给新位置
    navigate(`/history/${key}`);
    localStorage.setItem('chartId', key);
  };
  // 通过列表的图表信息填充菜单项数据
  const items = chartPageList?.records?.map((item) => {
    return (
      <Menu.Item
        className={`my-item ${item.highlight ? 'fade-in-out' : ''}`}
        style={{padding: '10px', borderRadius: '4px'}}
        key={item.id}
        onClick={(key) => {
          handleMenuClick(key.key)
        }}
      >
        {item.generationName}
      </Menu.Item>
    )
  });

  /**
   * 搜索框处理,搜索条件：ChartQueryDTO
   * Long id 、String goalDescription 、 String generationName 、Long userId
   */
    // 图表信息类型
  interface chartType {
    id: number;
    goalDescription: string
    generationName: string
    aiTokenUsage: number
    userId: number
    codeComments: string
    rawData: string
    codeProfileDescription: string
    codeEntities: string
    codeApis: string
    codeExecution: string
    codeSuggestions: string
    codeNormRadar: string
    codeNormRadarDescription: string
    codeTechnologyPie: string
    codeCatalogPath: string
    createTime: string
    updateTime: string
    isDelete: number
  }

  // 搜索排序
  const mergeAndHighlight = (list1: chartType[], list2: chartType[]) => {
    // 先将list2的元素添加到结果中，然后过滤掉list1中在list2中已存在的元素
    const merged = [...list2, ...list1.filter(item => !list2.some(searchItem => searchItem.id === item.id))];
    // 对合并后的数组进行映射，为在list2中存在的元素添加highlight属性
    return merged.map(item => ({
      ...item,
      highlight: list2.some(searchItem => searchItem.id === item.id),
    }));
  };
  // 开始搜索
  const handleSearch = async (value: string) => {
    let formSearchData = {id: 0, generationName: "", goalDescription: "", userId: initialState?.currentUser?.id};
    // 如果是数字，尝试使用id搜索
    const parsedId = parseInt(value, 10);
    if (!isNaN(parsedId)) {
      formSearchData = {id: parsedId, generationName: "", goalDescription: "", userId: initialState?.currentUser?.id};
    } else {
      // 否则作为 generationName 或者 goalDescription搜索
      formSearchData = {id: 0, generationName: value, goalDescription: value, userId: initialState?.currentUser?.id};
    }
    console.log(formSearchData)
    // 开始搜索
    const res = await listChartInfo({pageModel: {...searchParams}}, {...formSearchData})
    if (res.code === 200) {
      // 暂时修改图表分页查询的结果列表
      console.log(res.data?.records)
      const newMergedList = mergeAndHighlight(chartPageList?.records as chartType[], res.data?.records as chartType[])
      setChartPageList({records: newMergedList})
      message.success('搜索成功')
    } else {
      message.error('搜索失败' + res.msg)
    }
  };


  /**
   * 顶部按钮处理
   */
  // 点击设置与渲染
  type FormItem = 'fileUpload' | 'textInput' | 'filesUpload';
  const [currentFormItem, setCurrentFormItem] = useState<FormItem>('filesUpload');
  const buttons = [
    {key: 'fileUpload', label: '单文件上传', span: 8, style: {width: '80%', marginLeft: '20%'}},
    {key: 'filesUpload', label: '多文件上传', span: 8, style: {width: '100%'}},
    {key: 'textInput', label: '输入文本', span: 8, style: {width: '80%', marginRight: '20%'}},
  ];

  /**
   * 实现单文件分析接口
   */
    // 避免重复提交
  const [submitting, setSubmitting] = useState<boolean>(false);
  // 上传文件（同步）
  const genFile = async (values: any) => {
    // todo 上传文件
    try {
      console.log(values);
      // 如果正在提交中，则直接返回避免重复提交
      if (submitting) {
        message.error('正在提交中');
        return;
      }
      // 设置提交中状态
      setSubmitting(true);
      // 构造请求参数

      // 调用接口
      const res = await genFileChart({
        file: values.file.file.originFileObj,
        goalDescription: values.goalDescription,
        generationName: values.generationName
      }, values.file.file.originFileObj);
      if (res.code === 200) {
        sessionStorage.setItem('reloaded', 'false');
        navigate(`/history/${res.data?.id}`);
        message.success('分析成功');
        setSubmitting(false);
        return;
      } else {
        setSubmitting(false);
        message.error('分析失败' + res.msg);
      }
    } catch (error) {
      setSubmitting(false);
      message.error('分析失败');
    }
  };

  /**
   * 实现多文件分析接口
   */
  const genFiles = async (values: any) => {
    console.log([])
    try {
      // 如果正在提交中，则直接返回避免重复提交
      if (submitting) {
        message.error('正在提交中');
        return;
      }
      // 设置提交中状态
      setSubmitting(true);
      // 构造请求参数
      const res = await genMultipleChart({
        files: values.files.fileList?.map((file: any) => file.originFileObj),
        goalDescription: values.goalDescription,
        generationName: values.generationName
      }, values.files.fileList?.map((file: any) => file.originFileObj));
      if (res.code === 200) {
        sessionStorage.setItem('reloaded', 'false');
        navigate(`/history/${res.data?.id}`);
        message.success('分析成功');
        setSubmitting(false);
        return;
      } else {
        setSubmitting(false);
        message.error('分析失败' + res.msg);
      }
    } catch (error) {
      setSubmitting(false);
      message.error('分析失败' + error);
    }
  };
  /**
   * 实现文本分析接口
   */
  const genText = async (values: any) => {
    console.log({...values})
    try {
      // 如果正在提交中，则直接返回避免重复提交
      if (submitting) {
        message.error('正在提交中');
        return;
      }
      // 设置提交中状态
      setSubmitting(true);
      // 构造请求参数
      const res = await genTextChart({
        generationName: values.generationName,
        goalDescription: values.goalDescription,
        text:  values.textInput
      });
      if (res.code === 200) {
        sessionStorage.setItem('reloaded', 'false');
        navigate(`/history/${res.data?.id}`);
        message.success('分析成功');
        setSubmitting(false);
        return;
      } else {
        setSubmitting(false);
        message.error('分析失败' + res.msg);
      }
    } catch (error) {
      setSubmitting(false);
      message.error('分析失败' + error);
    }
  };
  useEffect(() => {
    // 设置默认的表单项为文件上传
    setCurrentFormItem('filesUpload');
    getChartListData();

  }, []); // 空依赖数组表示仅在组件挂载时运行一次

  const {
    token: {colorBgContainer, borderRadiusLG},
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

        <div className="demo-logo-vertical"/>
        <Button
          size="large"
          style={{width: '100%', border: 'none', margin: '8px 0'}}
          type={'primary'}
        >
          历史记录
        </Button>

        <div style={{padding: '12px 0'}}>
          <Search placeholder="搜索" allowClear onSearch={handleSearch} onChange={getChartListData}/>
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['']}
          selectedKeys={[localStorage.getItem('chartId') || '']}
        >
          {items}
        </Menu>
      </Sider>

      <Layout style={{marginLeft: 200}}>

        <Space.Compact block></Space.Compact>
        <Typography style={{margin: '16px 0', display: 'flex', justifyContent: 'center'}}>
          <Title level={3}>基于文本生成式AI大模型的Github源代码分析及可视化平台</Title>
        </Typography>

        <Row>
          {buttons.map(button => (
            <Col key={button.key} span={button.span}>
              <Button
                type={currentFormItem === button.key ? 'primary' : 'default'}
                size="large"
                style={button.style}
                onClick={() => setCurrentFormItem(button.key as FormItem)}
              >
                {button.label}
              </Button>
            </Col>
          ))}
        </Row>

        <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
          <div style={{
            padding: 24,
            textAlign: 'center',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>

            {currentFormItem === 'fileUpload' && (
              <FileUploadForm onFinish={genFile} submitting={submitting} extraComponent={
                <Form.Item style={{margin: '12px 12px'}} name="file">
                  <Upload.Dragger style={{padding: '24px'}}>
                    <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                    <p className="ant-upload-text">点击上传文件</p>
                    <p className="ant-upload-hint">在这里可以上传单个文件，支持的文件格式编码为TUF-8</p>
                  </Upload.Dragger>
                </Form.Item>
              }/>
            )}

            {currentFormItem === 'filesUpload' && (
              <FileUploadForm onFinish={genFiles} submitting={submitting} extraComponent={
                <Form.Item name="files">
                  <Upload.Dragger
                    style={{padding: '24px'}}
                    name="files"
                    directory={true}
                    showUploadList={true}>
                    <p className="ant-upload-drag-icon"><InboxOutlined/></p>
                    <p className="ant-upload-text">点击上传文件夹</p>
                    <p className="ant-upload-hint">在这里可以上传多个文件，也就是文件，支持的文件格式编码为TUF-8</p>
                  </Upload.Dragger>
                </Form.Item>
              }/>
            )}

            {currentFormItem === 'textInput' && (
              <FileUploadForm onFinish={genText} submitting={submitting} extraComponent={
                <Form.Item name="textInput">
                  <Input
                    placeholder="这里可以输入文本，支持markdown语法"
                    size={"large"}
                    style={{height: '150px'}}
                  ></Input>
                </Form.Item>
              }/>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chart;

