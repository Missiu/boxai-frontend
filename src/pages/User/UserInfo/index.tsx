/**
 * Chart组件：用于展示用户信息和提供用户信息编辑功能。
 *
 * 该组件通过调用服务获取登录用户信息，并在页面上展示用户名称、账户类型等信息。
 * 同时，提供一个模态框用于编辑用户信息，用户可以修改自己的基本信息并提交更新。
 */
import { getLoginUserUsingGet, updateUserUsingPost } from '@/services/boxai/userController';
import { AntDesignOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  FloatButton,
  Form,
  Input,
  List,
  Modal,
  Space,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';

const Chart: React.FC = () => {
  // 登录响应数据状态
  const [response, setResponse] = useState<API.UserInfoResponse>();
  // 用户角色状态
  const [userRole, setRole] = useState<any>();
  // 初始化加载状态
  const [initLoading, setInitLoading] = useState(true);
  // 用户信息列表状态
  const [list, setList] = useState<any[]>([]);
  // 模态框可见性状态
  const [visible, setVisible] = useState(false);
  // 用户信息编辑表单数据状态
  const [formData, setFormData] = useState<API.UserUpdateRequest>({
    userName: '',
    userProfile: '',
    userAccount: '',
    userPassword: '',
  });

  // 根据用户角色设置用户类型名称
  const Role = () => {
    if (response?.userRole === 'user') {
      setRole('基础用户');
    }
    if (response?.userRole === 'admin') {
      setRole('高级用户');
    }
  };
  // 使用useEffect钩子获取登录用户信息并更新状态
  useEffect(() => {
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
    fetchData().then(() => Role());
  }, []); // 空数组依赖项表示useEffect只在挂载时运行一次

  // 处理表单提交事件
  const handleFormSubmit = async () => {
    try {
      await updateUserUsingPost(formData);
      message.success('用户信息修改成功');
      setVisible(false);
      window.location.reload(); // 刷新页面以显示更新后的信息
    } catch (error) {
      console.error('Error updating user info:', error);
      message.error('用户信息修改失败');
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
            { key: '1', label: '用户名称', children: response?.userName, span: 3 },
            { key: '2', label: '账户类型', children: userRole, span: 3 },
          ]}
        />
      </Space>

      <Divider orientation="left">基本信息</Divider>
      <Space style={{ borderRadius: '20px', backgroundColor: '#ffffff', display: 'block' }}>
        <List
          loading={initLoading}
          size="large"
          dataSource={list}
          renderItem={(item) => (
            <List.Item style={{ display: 'block', marginTop: '10px' }}>
              <div>名称 : {item.userName}</div>
              <div style={{ marginTop: '20px' }}>账号: {item.userAccount}</div>
              <div style={{ marginTop: '20px' }}>简介: {item.userProfile}</div>
              <div style={{ marginTop: '20px' }}>用量: {item.usedToken}</div>
              <div style={{ marginTop: '20px' }}>余额: {item.token - item.usedToken}</div>
              <div style={{ marginTop: '20px' }}>总量: {item.token}</div>
              <div style={{ marginTop: '20px' }}>账户类型: {userRole}</div>
              <div style={{ marginTop: '20px' }}>创建时间 : {item.createTime}</div>
            </List.Item>
          )}
        />
        <Modal title="编辑用户信息" open={visible} onCancel={() => setVisible(false)} footer={null}>
          <Form onFinish={handleFormSubmit}>
            <Form.Item label="名称" name="userName">
              <Input
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="账号" name="userAccount">
              <Input
                value={formData.userAccount}
                onChange={(e) => setFormData({ ...formData, userAccount: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="密码" name="userPassword">
              <Input
                value={formData.userPassword}
                onChange={(e) => setFormData({ ...formData, userPassword: e.target.value })}
              />
            </Form.Item>
            <Form.Item label="简介" name="userProfile">
              <Input
                value={formData.userProfile}
                onChange={(e) => setFormData({ ...formData, userProfile: e.target.value })}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <FloatButton onClick={() => setVisible(true)} />
      </Space>
    </>
  );
};
export default Chart;
