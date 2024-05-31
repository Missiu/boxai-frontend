import {Card, Divider, Flex, FloatButton, Layout, message, Slider, Switch, theme, Typography,} from 'antd';
import React, {useEffect, useState} from 'react';
import {useModel} from "@@/exports";
import {listChartInfo} from "@/services/boxai/dataChartController";
import ReactMarkdown from 'react-markdown';
import EChartsReact from "echarts-for-react";
import {
  DislikeOutlined,
  FullscreenOutlined,
  LeftSquareOutlined,
  LikeOutlined,
  LinkOutlined,
  MessageOutlined,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {listPosts} from '@/services/boxai/postController';
import {doLike} from "@/services/boxai/likeController";
import {doFavorite} from "@/services/boxai/favoriteController";

const {Content} = Layout;
const {Title, Paragraph, Text} = Typography;

const History: React.FC = () => {

  /**
   * 根据id查询char信息
   * 展示
   */
  const {initialState} = useModel('@@initialState');
  const chartId = localStorage.getItem('postId');
  // 分页信息请求
  const [searchParams] = useState<API.PageModel>();
  // 图表列表信息请求
  const [formChartListData, setFormChartListData] = useState<API.ChartQueryDTO>({});
  const [chartInfo, setChartInfo] = useState<API.UniversalDataChartsVO>();
  const getChartListData = async () => {
    try {
      if (chartId) {
        setFormChartListData({id: parseInt(chartId)});
      }
      const res = await listChartInfo({pageModel: {...searchParams}}, {...formChartListData});
      if (res.code === 200) {
        setChartInfo(res.data)
      } else {
        message.error('获取历史数据失败' + res.msg);
      }
    } catch (error) {
      message.error('异常: 获取数据失败');
    }
  };



  // 数据扩张
  const [rows, setRows] = useState(2);
  const [expanded, setExpanded] = useState(false);
  // 获取帖子信息
  const [postInfo, setPostInfo] = useState<API.PagePostListQueryVO>()
  const getPostVO = async () => {
    try {
      const res = await listPosts({pageModel: {...searchParams}},{postId:parseInt(chartId),userId: initialState?.currentUser?.id});
      if (res.code === 200) {
        setPostInfo(res.data)
      } else {
        message.error('获取帖子信息失败' + res.msg);
      }
    } catch (error) {
      message.error('异常: 获取帖子信息失败');
    }
  };
  // 模态框可视化
  const [modalVisible, setModalVisible] = useState(false);
  // onChange 处理函数，用于更新 open 状态
  const onChange = (event) => {
    // event.target.checked 用于获取 Switch 的状态
    setModalVisible(event.target.checked);
  };
  const handleLike = async (id: number) => {
    console.log(id)
    if (id === 0) {
      message.error('点赞失败，帖子id不存在');
      return;
    }
    try {
      const res = await doLike({userId: initialState?.currentUser?.id, postId: id})
      // 点赞
      if (res.code === 200 && res.data === true) {
        postInfo?.records?.map((post) => {
          if (post.postId === id) {
            post.likesCount = post.likesCount + 1
          }
        })
        setPostInfo({...postInfo})
        message.success('点赞成功');
      }
      if (res.code === 200 && res.data === false) {
        postInfo?.records?.map((post) => {
          if (post.postId === id) {
            post.likesCount = post.likesCount - 1
          }
        })
        setPostInfo({...postInfo})
        message.success('取消成功');
      }
    } catch (error) {
      console.error('点赞错误:', error);
    }
  };

  const handleFavorite = async (id: number) => {
    console.log(id)
    if (id === 0) {
      message.error('收藏失败，帖子id不存在');
      return;
    }
    try {
      const res = await doFavorite({userId: initialState?.currentUser?.id, postId: id})
      // 点赞
      if (res.code === 200 && res.data === true) {
        postInfo?.records?.map((post) => {
          if (post.postId === id) {
            post.favoritesCount = post.favoritesCount + 1
          }
        })
        setPostInfo({...postInfo})
        message.success('收藏成功');
      }
      if (res.code === 200 && res.data === false) {
        postInfo?.records?.map((post) => {
          if (post.postId === id) {
            post.favoritesCount = post.favoritesCount - 1
          }
        })
        setPostInfo({...postInfo})
        message.success('取消成功');
      }
      // getPostVO()
    } catch (error) {
      console.error('点赞错误:', error);
    }
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
  const goBack = () => {
    history.back();
  };

  useEffect(() => {
    if (chartId) {
      getChartListData()
      getPostVO()
    }
  }, []);

  const renderContent = () => {
    if (chartId) {
      // 根据chartId获取详细的图表数据
      const selectedChart = chartInfo?.records?.find((chart) => String(chart.id) === chartId);
      if (selectedChart) {
        let codeTechnologyPie = null;
        let codeEntities = null;
        let codeNormRadar = null;
        try {
          codeTechnologyPie = JSON.parse(selectedChart.codeTechnologyPie);
          codeEntities = JSON.parse(selectedChart.codeEntities);
          codeNormRadar = JSON.parse(selectedChart.codeNormRadar);
        } catch (e) {
          codeTechnologyPie = null;
          codeEntities = null;
          codeNormRadar = null;
        }

        return (
          <>
            {/*前言*/}
            <Typography>
              <Card>
                <Paragraph
                  style={{textAlign: 'left'}}
                >
                  <Text strong>分析名称 : {selectedChart.generationName}</Text>
                </Paragraph>
                <Paragraph
                  style={{textAlign: 'left'}}
                >
                  <Text strong>分析目标 : {selectedChart.goalDescription}</Text>
                </Paragraph>
                <Paragraph style={{textAlign: 'left'}}>
                  <Text strong>消耗token : {selectedChart.aiTokenUsage}</Text>
                </Paragraph>

                {/*原始数据部分*/}
                <Paragraph>
                  <Text strong>原始数据</Text>

                  <Flex gap={16} align="center">
                    <Switch
                      checked={expanded}
                      onChange={() => setExpanded((c) => !c)}
                      style={{flex: 'none'}}
                    />
                    <Slider
                      min={1}
                      max={20}
                      value={rows}
                      onChange={setRows}
                      style={{flex: 'auto'}}
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
            {/*项目简介*/}
            {selectedChart.codeProfileDescription && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}
                >
                  项目简介
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{selectedChart.codeProfileDescription}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目注释*/}
            {selectedChart.codeComments && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}
                >
                  项目核心代码注释
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{ selectedChart.codeComments}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目技术栈*/}
            {codeTechnologyPie && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  项目技术栈分布
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    {codeTechnologyPie ? (
                      <EChartsReact option={codeTechnologyPie}/>
                    ) : (
                      <ReactMarkdown>{selectedChart.codeTechnologyPie}</ReactMarkdown>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目运行*/}
            {selectedChart.codeExecution && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  项目运行
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{ selectedChart.codeExecution}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目实体关系*/}
            {codeEntities && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}
                >
                  项目实体关系图
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    {codeTechnologyPie ? (
                      <EChartsReact option={codeEntities}/>
                    ) : (
                      <ReactMarkdown>{ selectedChart.codeEntities}</ReactMarkdown>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目API*/}
            {selectedChart.codeApis && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  项目第三方API调用情况
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{ selectedChart.codeApis}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*规范评分说明*/}
            {selectedChart.codeNormRadarDescription && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  规范评分说明
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{selectedChart.codeNormRadarDescription}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目雷达评分图*/}
            {codeNormRadar && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  项目雷达评分图
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    {codeTechnologyPie ? (
                      <EChartsReact option={codeNormRadar}/>
                    ) : (
                      <ReactMarkdown>{ selectedChart.codeNormRadar}</ReactMarkdown>
                    )}
                  </Card>
                </Paragraph>
              </Typography>
            )}

            {/*项目优化建议*/}
            {selectedChart.codeSuggestions && (
              <Typography style={{textAlign: 'left'}}>
                <Title
                  level={3}

                >
                  项目优化建议
                </Title>
                <Paragraph>
                  {/*{selectedChart.codeProfile}*/}
                  <Card style={{backgroundColor: '#fafafa'}}>
                    <ReactMarkdown>{ selectedChart.codeSuggestions}</ReactMarkdown>
                  </Card>
                </Paragraph>
              </Typography>
            )}
            <FloatButton onClick={() => setModalVisible(true)} icon={<UploadOutlined/>}/>
            {/* 模态框 */}
            <FloatButton.Group
              badge={{ dot: true }}
              open={modalVisible}
              trigger="click"
              onClick={onChange}
              style={{ right: 24 }}
              icon={<FullscreenOutlined />}
            >
              <FloatButton
                icon={<LikeOutlined />}
                onClick={() => handleLike(parseInt(chartId))}
                description={postInfo?.records?.[0].likesCount ?? 0}
              >
                {/*{postList?.favourNum}*/}
              </FloatButton>
              <FloatButton
                icon={<StarOutlined />}
                onClick={() => handleFavorite(selectedChart.id)}
                description={postInfo?.records?.[0].favoritesCount ?? 0}
              />
              <FloatButton icon={<LinkOutlined />} onClick={copyLink} />
              <FloatButton icon={<MessageOutlined />} />
              <FloatButton icon={<DislikeOutlined />} />
            </FloatButton.Group>
            <Switch onChange={onChange} checked={modalVisible} style={{ margin: 16 }} />
            <FloatButton
              icon={<LeftSquareOutlined />}
              shape="circle"
              style={{ right: 24 + 70 }}
              onClick={goBack}
            />
          </>
        );
      }
    }
    return (
      <Card>
        <Text>暂无数据</Text>
      </Card>
    );
  };

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  return (
    <Content style={{margin: '8px 16px 0', overflow: 'initial'}}>
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
  );
};

export default History;
