/**
 * Chart组件：用于展示用户信息和提供用户信息编辑功能。
 *
 * 该组件通过调用服务获取登录用户信息，并在页面上展示用户名称、账户类型等信息。
 * 同时，提供一个模态框用于编辑用户信息，用户可以修改自己的基本信息并提交更新。
 */
import {
  getLoginUserUsingGet,
  upAccountUsingPost,
  upPasswordUsingPost,
  upUserNameUsingPost,
  upUserProfileUsingPost,
  userLogoutUsingPost,
} from '@/services/boxai/userController';
import { AntDesignOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Typography,
  message,
} from 'antd';
// import Paragraph from 'antd/es/skeleton/Paragraph';
import { history } from '@@/core/history';
import { stringify } from 'querystring';
import React, { useEffect, useState } from 'react';

const { Title, Paragraph, Text } = Typography;

const UserInfo: React.FC = () => {
  // 登录响应数据状态
  const [response, setResponse] = useState<API.UserInfoResponse>();
  // 用户角色状态
  const [userRole, setRole] = useState<any>();
  // 初始化加载状态
  const [initLoading, setInitLoading] = useState(true);
  // 用户信息列表状态
  const [list, setList] = useState<any[]>([]);
  // 模态框可见性状态
  const [formPasswordVisible, setFormPasswordVisible] = useState(false);
  const [formPasswordData, setFormPasswordData] = useState({
    newPassword: '',
    checkPassword: '',
    oldPassword: '',
  });

  const fetchData = async () => {
    try {
      const mes = await getLoginUserUsingGet();
      console.log(mes);
      setResponse(mes?.data);
      const { data } = mes;
      // 将数据对象添加到列表数组中
      setList([data]);
      setInitLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const Role = () => {
    if (response?.userRole === 'user') {
      setRole('基础用户');
    }
    if (response?.userRole === 'admin') {
      setRole('高级用户');
    }
  };
  useEffect(() => {
    Role(); // 确保在获取到响应数据后调用 Role 函数
    fetchData();
  }, []); // 空数组依赖项表示useEffect只在挂载时运行一次

  // 处理表单提交事件
  const handleSubmitName = async (newName: string) => {
    try {
      await upUserNameUsingPost({ userName: newName }); // 假设 API 只需要用户名
      message.success('修改成功');
      // 更新状态来反映新的用户名，而不是刷新整个页面
      setResponse((prevState) => ({
        ...prevState,
        userName: newName,
      }));
    } catch (error) {
      console.error('Error updating user info:', error);
      message.error('修改失败');
    }
  };
  // 修改账户信息
  const handleSubmitAccount = async (newAccount: string) => {
    try {
      await upAccountUsingPost({ userAccount: newAccount });
      message.success('账户修改成功');
      // 更新状态以局部刷新界面
      setResponse((prevState) => ({
        ...prevState,
        userAccount: newAccount,
      }));
      await userLogoutUsingPost();
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      /**
       * 如果当前路径不是登录页且没有重定向参数，则跳转到登录页，并带上当前路径
       */
      const redirect = urlParams.get('redirect');
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    } catch (error) {
      console.error('Error updating account info:', error);
      message.error('账户修改失败');
    }
  };

  const showPasswordForm = () => {
    setFormPasswordVisible(true);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormPasswordData({
      ...formPasswordData,
      [name]: value,
    });
  };

  const handleSubmitPassword = async () => {
    if (formPasswordData.newPassword !== formPasswordData.checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      await upPasswordUsingPost(formPasswordData);
      message.success('密码修改成功');
      setFormPasswordVisible(false); // 关闭模态框
      setFormPasswordData({
        newPassword: '',
        checkPassword: '',
        oldPassword: '',
      }); // 重置表单数据
      await userLogoutUsingPost();
      const { search, pathname } = window.location;
      const urlParams = new URL(window.location.href).searchParams;
      /**
       * 如果当前路径不是登录页且没有重定向参数，则跳转到登录页，并带上当前路径
       */
      const redirect = urlParams.get('redirect');
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      message.error('密码修改失败');
    }
  };
  // 修改简介信息
  const handleSubmitProfile = async (newProfile: string) => {
    try {
      await upUserProfileUsingPost({ userProfile: newProfile });
      message.success('简介修改成功');
      // 更新状态以局部刷新界面
      setResponse((prevState) => ({
        ...prevState,
        userProfile: newProfile,
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('简介修改失败');
    }
  };

  // 页面渲染逻辑
  return (
    <>
      <Space style={{ borderRadius: '20px', backgroundColor: '#ffffff' }}>
        <Avatar
          style={{ margin: '50px' }}
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
          icon={<AntDesignOutlined />}
          src={response?.userAvatar}
        />
        <Descriptions
          items={[
            {
              key: '1',
              label: (
                <Text strong style={{ lineHeight: '32px' }}>
                  用户名称
                </Text>
              ),
              children: (
                <Text strong style={{ lineHeight: '32px' }}>
                  {response?.userName}
                </Text>
              ),
              span: 3,
            },
            {
              key: '2',
              label: (
                <Text strong style={{ lineHeight: '32px' }}>
                  账户类型
                </Text>
              ),
              children: (
                <Text strong style={{ lineHeight: '32px' }}>
                  {userRole || '基础用户'}
                </Text>
              ),
              span: 2,
            },
            {
              key: '3',
              label: (
                <Text strong style={{ lineHeight: '32px' }}>
                  修改密码
                </Text>
              ),
              children: (
                <div>
                  <Button type="primary" shape="circle" onClick={showPasswordForm}>
                    A
                  </Button>
                </div>
              ),
              span: 1,
            },
          ]}
        />
      </Space>
      <Modal
        title="修改密码"
        open={formPasswordVisible}
        onOk={handleSubmitPassword}
        onCancel={() => setFormPasswordVisible(false)}
        okText="提交"
        cancelText="取消"
      >
        <Form layout="vertical" onFinish={handleSubmitPassword} initialValues={{ remember: true }}>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码!' }]}
          >
            <Input.Password onChange={handlePasswordChange} name="oldPassword" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码!' }]}
          >
            <Input.Password onChange={handlePasswordChange} name="newPassword" />
          </Form.Item>
          <Form.Item
            name="checkPassword"
            label="确认密码"
            rules={[{ required: true, message: '请确认密码!' }]}
          >
            <Input.Password onChange={handlePasswordChange} name="checkPassword" />
          </Form.Item>
        </Form>
      </Modal>
      <Divider orientation="left">基本信息</Divider>
      <Space style={{ borderRadius: '12px', display: 'block' }}>
        <List
          loading={initLoading}
          size="large"
          dataSource={list}
          renderItem={(item) => (
            <List.Item style={{ display: 'block' }}>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'可用余额'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph style={{ marginRight: '50%', width: '100%' }}>
                    <Text strong>
                      {item.availableBalance ? <>{item.availableBalance}</> : <>0</>}
                    </Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'代金券'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph style={{ marginRight: '50%', width: '100%' }}>
                    <Text strong>{item.voucherBalance ? <>{item.voucherBalance}</> : <>0</>}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'现金'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph style={{ marginRight: '50%', width: '100%' }}>
                    <Text strong>{item.cashBalance ? <>{item.cashBalance}</> : <>0</>}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'名称'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph
                    style={{ marginRight: '50%', width: '100%' }}
                    editable={{
                      onChange: async (value: string) => {
                        await handleSubmitName(value);
                      },
                      text: response?.userName || item.userName,
                    }}
                  >
                    <Text strong>{response?.userName || item.userName}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'账号'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph
                    style={{ marginRight: '50%', width: '100%' }}
                    editable={{
                      onChange: async (value: string) => {
                        await handleSubmitAccount(value);
                      },
                      text: response?.userAccount || item.userAccount,
                    }}
                  >
                    <Text strong>{response?.userAccount || item.userAccount}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'简介'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph
                    style={{ marginRight: '50%', width: '100%' }}
                    editable={{
                      onChange: async (value: string) => {
                        await handleSubmitProfile(value);
                      },
                      text: response?.userProfile || item.userProfile,
                    }}
                  >
                    <Text strong>{response?.userProfile || item.userProfile}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'账户类型'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph style={{ marginRight: '50%', width: '100%' }}>
                    <Text strong>{userRole ? <>{userRole}</> : <>基础账户</>}</Text>
                  </Paragraph>
                </Col>
              </Row>
              <Row
                style={{
                  borderRadius: '12px',
                  marginTop: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                }}
              >
                <Col span={8}>
                  <Title level={5} style={{ marginLeft: '25%', width: '100%' }}>
                    {'创建时间'}
                  </Title>
                </Col>
                <Col span={8}></Col>
                <Col span={8}>
                  <Paragraph style={{ marginRight: '50%', width: '100%' }}>
                    <Text strong>{item.createTime}</Text>
                  </Paragraph>
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Space>
    </>
  );
};
export default UserInfo;
