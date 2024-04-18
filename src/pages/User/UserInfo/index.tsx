import { getLoginUserUsingGet, updateMyUserUsingPost } from '@/services/boxai/userController';
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
  // 用户信息获取
  const [response, setResponse] = useState<API.LoginUserResponse>();
  const [userRole, setRole] = useState<any>();
  const [initLoading, setInitLoading] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState<API.UserUpdateMyRequest>({
    userAvatar: '',
    userName: '',
    userProfile: '',
  });

  const Role = () => {
    if (response?.userRole === 'user') {
      setRole('基础用户');
    }
    if (response?.userRole === 'admin') {
      setRole('高级用户');
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mes = await getLoginUserUsingGet();
        setResponse(mes?.data);
        const { data } = mes;
        // 将 data 对象添加到 list 数组中
        setList([data]);
        setInitLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData().then(() => Role());
  }, []); // 这里的空数组表示 useEffect 只会在组件挂载时调用一次

  const handleFormSubmit = async () => {
    console.log('111');
    try {
      await updateMyUserUsingPost(formData);
      message.success('用户信息修改成功');
      setVisible(false);
      window.location.reload(); // 刷新页面
    } catch (error) {
      console.error('Error updating user info:', error);
      message.error('用户信息修改失败');
    }
  };

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
            { key: '2', label: '账户类型', span: 3, children: userRole },
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
        <Modal
          title="编辑用户信息"
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
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
            <Form.Item label="头像" name="userAvatar">
              <Input
                value={formData.userAvatar}
                onChange={(e) => setFormData({ ...formData, userAvatar: e.target.value })}
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
