import {
  doPostFavourUsingPost,
  doThumbUsingPost,
  listPostVoByPageUsingPost,
} from '@/services/boxai/postController';
import { listChartByPageUsingPost } from '@/services/boxai/resultController';
import {
  DislikeOutlined,
  FullscreenOutlined,
  LeftSquareOutlined,
  LikeOutlined,
  LinkOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import {
  Card,
  Divider,
  Flex,
  FloatButton,
  Layout,
  Slider,
  Switch,
  Typography,
  message,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const PostData: React.FC = () => {
  // 使用 useState 钩子来定义 open 状态
  const [open, setOpen] = useState(true);

  // onChange 处理函数，用于更新 open 状态
  const onChange = (event) => {
    // event.target.checked 用于获取 Switch 的状态
    setOpen(event.target.checked);
  };
  const { Content } = Layout;
  const { Title, Paragraph, Text } = Typography;
  const [postList, setPostList] = useState<API.PostVO>();
  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const [state, setState] = useState({
    resultId: 0,
    userId: 0,
  });
  const [chartData, setChartData] = useState<API.Result | undefined>(undefined); // 用于存储获取的图表数据
  // 获取帖子列表信息
  const getPostList = async () => {
    try {
      const res = await listPostVoByPageUsingPost({
        current: 1,
        pageSize: 1,
        resultId: state.resultId,
      });
      setPostList(res.data?.records[0]);
      // console.log(res.data)
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  const goBack = () => {
    history.back();
  };
  // 创建复制链接文本的函数
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // 这里可以提示用户链接已成功复制
      alert('当前页面链接已复制到剪贴板');
    } catch (err) {
      console.error('无法复制到剪贴板: ', err);
      // 这里可以提示用户复制失败
      alert('复制失败，请尝试手动复制');
    }
  };
  useEffect(() => {
    // 使用 location.search 来解析查询参数
    const searchParams = new URLSearchParams(location.search);
    const resultId = searchParams.get('resultId');
    const userId = searchParams.get('userId');

    // 将字符串参数转换为数字，并设置状态
    setState({
      resultId: resultId ? Number(resultId) : 0,
      userId: userId ? Number(userId) : 0,
    });
    // 使用 resultId 和 userId 进行异步操作获取数据
    const loadData = async () => {
      if (state.resultId && state.userId) {
        try {
          const res = await listChartByPageUsingPost({
            id: state.resultId,
            // userId: state.userId,
            current: 1,
            pageSize: 1,
          });
          if (res.data?.records) {
            console.log(res.data?.records[0]);
            setChartData(res.data?.records[0]);
          }
          // 假设返回的数据在 res.data 中
        } catch (error) {
          setChartData(undefined);
          console.error('Failed to load chart data:', error);
          // 处理错误，例如设置一个状态来显示错误消息
        }
      }
    };
    loadData();
    getPostList();
  }, [location.search, state.resultId, state.userId]); // 仅当 resultId 或 userId 改变时执行
  // 检查图表代码是否正确
  function checkChartCode(text: string) {
    return text;
  }

  const handleLike = async (id: number) => {
    if (id === 0) {
      message.error('点赞失败');
      return;
    }

    try {
      const newVar = await doThumbUsingPost({ postId: id });
      if (newVar.data === 1) {
        setPostList({ ...postList, thumbNum: (postList?.thumbNum ?? 0) + 1 });
        message.success('点赞成功');
      } else if (newVar.data === -1) {
        // 假设这里是取消点赞的逻辑
        setPostList({ ...postList, thumbNum: (postList?.thumbNum ?? 0) - 1 });
        message.success('取消成功');
      } else {
        message.error('状态异常');
      }
    } catch (error) {
      // 这里应该处理异步操作中可能出现的错误
      message.error('点赞时发生错误');
      console.error('Error liking post:', error);
    }
  };
  const handleFavorite = async (id: number) => {
    if (id === 0) {
      message.error('收藏失败');
    }
    const newVar = await doPostFavourUsingPost({ postId: id });

    if (newVar.data === 1) {
      setPostList({ ...postList, favourNum: (postList?.favourNum ?? 0) + 1 });
      message.success('收藏成功');
    } else if (newVar.data === -1) {
      // 假设这里是取消点赞的逻辑
      setPostList({ ...postList, favourNum: (postList?.favourNum ?? 0) - 1 });
      message.success('取消成功');
    } else {
      message.error('状态异常');
    }
    // 这里应添加你的收藏逻辑
  };

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

  const renderContent = () => {
    if (chartData) {
      const codeNorm = parseCodeNorm(chartData.codeNorm ?? '');
      const codeTechnology = parseCodeNorm(chartData.codeTechnology ?? '');
      const codeEntity = parseCodeNorm(chartData.codeEntity ?? '');
      return (
        <>
          <Typography style={{ margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
            <Title level={3}>基于文本生成式AI大模型的Github源代码分析及可视化平台</Title>
          </Typography>
          {/*前言*/}
          <Typography>
            <Card>
              <Paragraph style={{ textAlign: 'left' }}>
                <Text strong>分析名称 : {chartData.genName}</Text>
              </Paragraph>
              <Paragraph style={{ textAlign: 'left' }}>
                <Text strong>消耗token : {chartData.usedToken}</Text>
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
                  {chartData.rawData}
                </Paragraph>
              </Paragraph>
            </Card>
          </Typography>
          <Divider orientation="center">分析结果如下</Divider>
          {/*代码解释*/}
          {chartData.codeComment && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>代码解释</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <Text>
                    <pre>{chartData.codeComment}</pre>
                  </Text>
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*项目简介*/}
          {chartData.codeProfile && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>项目简介</Title>
              <Paragraph>
                {/*{selectedChart.codeProfile}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <ReactMarkdown>{chartData.codeProfile}</ReactMarkdown>
                </Card>
              </Paragraph>
            </Typography>
          )}
          {chartData.codeCataloguePath && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>代码目录</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <Text>
                    <pre>{chartData.codeCataloguePath}</pre>
                  </Text>
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*项目技术栈*/}
          {chartData.codeTechnology !== '{}' && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>项目技术栈</Title>
              <Paragraph>
                <Card>
                  {codeTechnology === '{}' ? (
                    <ReactMarkdown>{chartData.codeTechnology}</ReactMarkdown>
                  ) : (
                    <ReactECharts option={codeTechnology}></ReactECharts>
                    // <ReactECharts option={selectedChart.codeEntity}></ReactECharts>
                  )}
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*如何运行*/}
          {chartData.codeRun && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>如何运行</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <ReactMarkdown>{chartData.codeRun}</ReactMarkdown>
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*实体关系*/}
          {chartData.codeEntity !== '{}' && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>实体关系</Title>
              <Paragraph>
                <Card>
                  {codeEntity === '{}' ? (
                    <ReactMarkdown>{chartData.codeEntity}</ReactMarkdown>
                  ) : (
                    <ReactECharts option={codeEntity}></ReactECharts>
                  )}
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*第三方API*/}
          {chartData.codeAPI && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>第三方API</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <ReactMarkdown>{chartData.codeAPI}</ReactMarkdown>
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*代码规范*/}
          {chartData.codeNorm !== '{}' && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>代码规范</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <ReactMarkdown>{chartData.codeNormStr}</ReactMarkdown>
                  {codeNorm === '{}' ? (
                    <ReactMarkdown>{chartData.codeNorm}</ReactMarkdown>
                  ) : (
                    <ReactECharts option={codeNorm}></ReactECharts>
                  )}
                </Card>
              </Paragraph>
            </Typography>
          )}
          {/*优化建议*/}
          {chartData.codeSuggestion && (
            <Typography style={{ textAlign: 'left' }}>
              <Title level={3}>优化建议</Title>
              <Paragraph>
                {/*{selectedChart.codeRun}*/}
                <Card style={{ backgroundColor: '#fafafa' }}>
                  <ReactMarkdown>{chartData.codeSuggestion}</ReactMarkdown>
                </Card>
              </Paragraph>
              <FloatButton.Group
                badge={{ dot: true }}
                open={open}
                trigger="click"
                onClick={onChange}
                style={{ right: 24 }}
                icon={<FullscreenOutlined />}
              >
                <FloatButton
                  icon={<LikeOutlined />}
                  onClick={() => handleLike(state.resultId)}
                  description={postList.thumbNum ?? 0}
                >
                  {/*{postList?.favourNum}*/}
                </FloatButton>
                <FloatButton
                  icon={<StarOutlined />}
                  onClick={() => handleFavorite(state.resultId)}
                  description={postList.favourNum ?? 0}
                />
                <FloatButton icon={<LinkOutlined />} onClick={copyLink} />
                <FloatButton icon={<MessageOutlined />} />
                <FloatButton icon={<DislikeOutlined />} />
              </FloatButton.Group>
              <Switch onChange={onChange} checked={open} style={{ margin: 16 }} />
              <FloatButton
                icon={<LeftSquareOutlined />}
                shape="circle"
                style={{ right: 24 + 70 }}
                onClick={goBack}
              />
            </Typography>
          )}
        </>
      );
    }
  };

  return (
    <Content style={{ margin: '8px 16px 0', overflow: 'initial' }}>
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          background: '#fff', // 假设的颜色，根据实际需要设置
          borderRadius: '8px', // 假设的边框半径，根据实际需要设置
        }}
      >
        {renderContent()}
      </div>
    </Content>
  );
};

export default PostData;
