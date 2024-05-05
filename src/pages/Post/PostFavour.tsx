import {
  doPostFavourUsingPost,
  doThumbUsingPost,
  listMyFavourPostByPageUsingPost,
} from '@/services/boxai/postController';
import Icon, { AntDesignOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import '@umijs/max';
import { Link } from '@umijs/max';
import { Avatar, Card, Descriptions, Flex, List, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Paragraph, Text } = Typography;

const PostFacour: React.FC = () => {
  const [, setTotal] = useState(0);
  const [postList, setPostList] = useState<API.PostVO[]>([]);
  const initSearchParams = {
    current: 1,
    pageSize: 10,
    // genName: '' // 添加搜索字段的初始值
  };
  const IconText = ({ icon: IconComponent, text, onClick, type }) => (
    <a onClick={onClick} style={{ marginRight: 16 }}>
      <IconComponent style={{ marginRight: 4 }} />
      {text}
      {type === 'like' && <Icon type="heart" />}
    </a>
  );
  const handleLike = async (id: number) => {
    if (id === 0) {
      message.error('点赞失败');
      return;
    }

    try {
      const newVar = await doThumbUsingPost({ postId: id });

      if (newVar.data === 1) {
        setPostList((prevList) =>
          prevList.map((item) =>
            item.resultId === id ? { ...item, thumbNum: (item.thumbNum ?? 0) + 1 } : item,
          ),
        );
        message.success('点赞成功');
      } else if (newVar.data === -1) {
        // 假设这里是取消点赞的逻辑
        setPostList((prevList) =>
          prevList.map((item) =>
            item.resultId === id
              ? { ...item, thumbNum: Math.max(0, (item.thumbNum ?? 0) - 1) }
              : item,
          ),
        );
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
      setPostList((prevList) =>
        prevList.map((item) =>
          item.resultId === id ? { ...item, favourNum: (item.favourNum ?? 0) + 1 } : item,
        ),
      );
      message.success('收藏成功');
    } else if (newVar.data === -1) {
      // 假设这里是取消点赞的逻辑
      setPostList((prevList) =>
        prevList.map((item) =>
          item.resultId === id
            ? { ...item, favourNum: Math.max(0, (item.favourNum ?? 0) - 1) }
            : item,
        ),
      );
      message.success('取消成功');
    } else {
      message.error('状态异常');
    }
    // 这里应添加你的收藏逻辑
  };

  // 获取帖子列表信息
  const getPostList = async () => {
    try {
      const res = await listMyFavourPostByPageUsingPost({ ...initSearchParams });
      setTotal(res.data?.total ?? 0);
      setPostList(res.data?.records ?? []);
      console.log(res.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    getPostList();
  }, []);
  // 渲染帖子列表
  const renderPostList = () => {
    return postList?.map((post) => (
      <List key={post.id} style={{ display: 'inline-block' }}>
        <List.Item style={{ width: '80vh', margin: '24px' }}>
          <Card
            size={'default'}
            title={
              <Flex align="center">
                <div>
                  <Avatar
                    style={{}}
                    size={{
                      xs: 12,
                      sm: 16,
                      md: 20,
                      lg: 32,
                    }}
                    icon={<AntDesignOutlined />}
                    src={post?.userAvatar}
                  />
                </div>
                <Descriptions
                  size={'small'}
                  style={{ marginLeft: '12px', width: 'calc(100% - 52px)' }} // 减去 Avatar 的宽度
                  items={[
                    {
                      key: '1',
                      children: <Text style={{ lineHeight: '32px' }}>{post?.userName}</Text>,
                      span: 1,
                    },
                    {
                      key: '2',
                      children: <Text style={{ lineHeight: '32px' }}>{post?.genName}</Text>,
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
                search: `?resultId=${post.resultId}&userId=${post.userId}`,
              }}
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
                  {/*<EllipsisMiddle suffixCount={12} >*/}
                  <Text type="secondary">{post.codeProfile ?? ''}</Text>
                  {/*</EllipsisMiddle>*/}
                </Paragraph>
              </Typography>
            </Link>
            <List.Item
              actions={[
                <IconText
                  icon={LikeOutlined}
                  text={post.thumbNum ?? 0}
                  key="list-vertical-like-o"
                  onClick={() => handleLike(post.resultId ?? 0)}
                  type="like"
                />,
                <IconText
                  icon={StarOutlined}
                  text={post.favourNum ?? 0}
                  key="list-vertical-star-o"
                  onClick={() => handleFavorite(post.resultId ?? 0)}
                />,
                // <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/>,
              ]}
            ></List.Item>
          </Card>
        </List.Item>
      </List>
    ));
  };
  return <div>{renderPostList()}</div>;
};
export default PostFacour;
