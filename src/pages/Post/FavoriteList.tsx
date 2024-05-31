import Icon, {AntDesignOutlined, LikeOutlined, StarOutlined} from '@ant-design/icons';
import '@umijs/max';
import {Link} from '@umijs/max';
import {Avatar, Card, Descriptions, Empty, Flex, List, message, Space, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {useModel} from "@@/exports";
import {doLike} from "@/services/boxai/likeController";
import {doFavorite, listFavorite} from '@/services/boxai/favoriteController';

const {Paragraph, Text} = Typography;

const FavorieList: React.FC = () => {
  // 获取已经分享的chart列表
  const {initialState} = useModel('@@initialState');
  const [postSharePageList, setPostSharePageList] = useState<API.PagePostListQueryVO>();
  // 初始化页面参数
  const initSearchParams = {
    pageModel: {
      page: 0,
      size: 0,
      allowDeep: false,
    },
  };
  // 分页信息请求
  const [searchParams] = useState<API.listPostsParams>(initSearchParams);

  // 分享大厅chart分页列表
  const handleShareList = async () => {
    const res = await listFavorite({...searchParams});
    if (res.code === 200) {
      console.log(res.data)
      setPostSharePageList(res.data)
      console.log(postSharePageList?.records)
      message.success('获取分享列表成功');
    } else {
      setPostSharePageList(undefined)
      message.error('暂无数据');
    }
  };
  // 点赞收藏渲染
  const IconText = ({icon, text, onClick, type}: {
    icon: React.FC;
    text: string;
    onClick: () => void;
    type?: 'like' | 'favorite';
  }) => (
    <Space>
      <a onClick={onClick} style={{marginRight: 16}}>
        {React.createElement(icon)}
        {text}
        {type === 'like' && <Icon type="heart"/>}
      </a>
    </Space>
  );

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
        postSharePageList?.records?.map((post) => {
          if (post.postId === id) {
            post.likesCount = post.likesCount + 1
          }
        })
        setPostSharePageList({...postSharePageList})
        message.success('点赞成功');
      }
      if (res.code === 200 && res.data === false) {
        postSharePageList?.records?.map((post) => {
          if (post.postId === id) {
            post.likesCount = post.likesCount - 1
          }
        })
        setPostSharePageList({...postSharePageList})
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
        postSharePageList?.records?.map((post) => {
          if (post.postId === id) {
            post.favoritesCount = post.favoritesCount + 1
          }
        })
        setPostSharePageList({...postSharePageList})
        message.success('收藏成功');
      }
      if (res.code === 200 && res.data === false) {
        postSharePageList?.records?.map((post) => {
          if (post.postId === id) {
            post.favoritesCount = post.favoritesCount - 1
          }
        })
        setPostSharePageList({...postSharePageList})
        message.success('取消成功');
      }
    } catch (error) {
      console.error('点赞错误:', error);
    }
  };

  useEffect(() => {
    handleShareList();
  }, []);


  // 渲染帖子列表
  const renderPostList = () => {
    if (postSharePageList){
      return postSharePageList?.records?.map((post) => (
          <List key={post.id} style={{display: 'inline-block'}}>
            <List.Item style={{width: '80vh', margin: '24px'}}>
              <Card
                  size={'default'}
                  title={
                    <Flex align="center">
                      <div>
                        <Avatar
                            size={{
                              xs: 12,
                              sm: 16,
                              md: 20,
                              lg: 32,
                            }}
                            icon={<AntDesignOutlined/>}
                            src={post?.avatarUrl}
                        />
                      </div>
                      <Descriptions
                          size={'small'}
                          style={{marginLeft: '12px', width: 'calc(100% - 52px)'}} // 减去 Avatar 的宽度
                          items={[
                            {
                              key: '1',
                              children: <Text style={{lineHeight: '32px'}}>{post?.nickname}</Text>,
                              span: 1,
                            },
                            {
                              key: '2',
                              children: <Text style={{lineHeight: '32px'}}>{post?.nickname}</Text>,
                              span: 2,
                            },
                          ]}
                      ></Descriptions>
                    </Flex>
                  }
                  bordered={false}
              >
                <Link
                    to={{
                      pathname: '/post/PostData',
                    }}
                    onClick={
                      () => {
                        localStorage.setItem("postId", post.postId)
                      }
                    }
                >
                  <Typography>
                    <Paragraph>
                      <Text>{post.content}</Text>
                    </Paragraph>
                    <Paragraph
                        ellipsis={{
                          rows: 3,
                        }}
                    >
                      <Text type="secondary">{post.codeProfileDescription}</Text>
                    </Paragraph>
                  </Typography>
                </Link>
                <List.Item
                    actions={[
                      <IconText
                          icon={LikeOutlined}
                          text={post.likesCount ?? 0}
                          key="list-vertical-like-o"
                          onClick={() => handleLike(post.postId)}
                          type="like"
                      />,
                      <IconText
                          icon={StarOutlined}
                          text={post.favoritesCount ?? 0}
                          key="list-vertical-star-o"
                          onClick={() => handleFavorite(post.postId)}
                      />,
                    ]}
                ></List.Item>
              </Card>
            </List.Item>
          </List>
      ));
    }else {
      return <Empty description="暂无数据" />;
    }

  };
  return <div>{renderPostList()}</div>;
};
export default FavorieList;
