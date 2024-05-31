import {
  updateUserInfo,
  updateUserKey,
  updateUserPassword,
  userLoginInfo,
  userLogout,
} from '@/services/boxai/userController';
import {AntDesignOutlined} from '@ant-design/icons';
import {Avatar, Button, Descriptions, Divider, Form, Input, List, message, Modal, Space, Typography,} from 'antd';
// import Paragraph from 'antd/es/skeleton/Paragraph';
import {history} from '@@/core/history';
import React, {useEffect, useState} from 'react';

import UserInfoItem from '@/components/Main/UserInfo/UserInfoItem';


const {Paragraph, Text} = Typography;

const UserInfo: React.FC = () => {
  // 用户信息
  const [userInfo, setUserInfo] = useState<API.UserInfoVO>();
  // 用户角色状态
  const [userRole, setRole] = useState<string>();
  // 初始化加载状 true 时，表示数据正在加载
  const [initLoading, setInitLoading] = useState(true);
  // 模态框可见性状态
  const [formPasswordVisible, setFormPasswordVisible] = useState(false);
  // 密码修改表单
  const [formPasswordData, setFormPasswordData] = useState<API.UserUpdatePasswordDTO>({
    checkPassword: "",
    newPassword: "",
    oldPassword: ""
  });
  // 用户信息修改表单
  const [formUserInfoData, setFormUserInfoData] = useState<API.UserUpdateDTO>();

  /**
   * 异步获取用户信息并更新相关状态
   * 无显式返回值，但会更新组件的状态，包括用户信息、用户信息列表和初始化加载状态
   */
  const getUserInfo = async () => {
    try {
      const mes = await userLoginInfo();
      // 获取用户登录信息后的处理
      if (mes.code === 200) {
        setUserInfo(mes?.data);
        // 设置初始化加载状态为完成
        setInitLoading(false);
        // 方便渲染
        if (mes.data?.role === 'user') {
          setRole('基础用户');
        } else if (mes.data?.role === 'vip') {
          setRole('高级用户');
        } else {
          setRole('基础用户');
        }
        return;
      }
      console.error("用户信息获取失败" + mes.msg);
    } catch (error) {
      // 捕获并记录获取用户信息过程中的异常
      console.error("异常: 用户信息获取失败");
    }
  };
  /**
   * 控制密码修改表单的显示
   */
  const showPasswordForm = () => {
    setFormPasswordVisible(true);
  };
  /**
   * 退出登录
   */
  const handleLogout = async () => {
    try {
      // 退出登录
      const mes = await userLogout();
      if (mes.code === 200) {
        const {pathname, search} = window.location;
        const urlParams = new URLSearchParams(search);
        const redirect = urlParams.get('redirect');

        // 判断当前路径是否为登录页且没有重定向参数，执行重定向逻辑
        if (pathname !== '/user/login' && !redirect) {
          sessionStorage.removeItem('token'); // 移除token，确保登录态失效
          const redirectUrl = redirect || pathname + search; // 计算重定向的URL，优先使用redirect参数
          history.replace(`/user/login?redirect=${encodeURIComponent(redirectUrl)}`); // 执行重定向
        }
        return; // 显式返回，结束函数体
      }
      message.error('退出失败' + mes.msg);
    } catch (error) {
      message.error('异常: 退出失败');
    }

  };

  /**
   * 提交密码修改表单
   */
  const handleSubmitPassword = async () => {
    if (!formPasswordData.oldPassword || !formPasswordData.newPassword || !formPasswordData.checkPassword) {
      message.error('请输入完整信息');
      return;
    }
    if (formPasswordData.newPassword !== formPasswordData.checkPassword) {
      message.error('两次输入密码不一致');
      return;
    }
    try {
      const mes = await updateUserPassword({...formPasswordData});
      if (mes.code === 200) {
        message.success('密码修改成功');
        // 关闭模态框
        setFormPasswordVisible(false);
        // 退出登录
        await handleLogout();
        return;
      }
      message.error('密码修改失败' + mes.msg);
    } catch (error) {
      message.error('异常: 密码修改失败');
    }
  };
  /**
   * 修改密码表单
   * @param event 输入事件
   */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setFormPasswordData({
      ...formPasswordData,
      [name]: value
    });
  };

  const handleSubmitUserInfo = async (values: any) => {
    try {
      const mes = await updateUserInfo({...values});
      setFormUserInfoData(values)
      if (mes.code === 200) {
        message.success('修改成功');
        if (values.userAccount) {
          handleLogout()
        }
        return;
      }
      message.error('修改失败' + mes.msg);
    } catch (error) {
      message.error('异常: 修改失败');
    }
  }

  // 用户信息修改表单
  const [formUserApiKey, setFormUserApiKey] = useState<API.UserUpdateKeyDTO>();
  const handleSubmitApiKey = async (values: any) => {
    try {
      const mes = await updateUserKey({...values});
      setFormUserApiKey(values)
      console.log(formUserApiKey)
      if (mes.code === 200) {
        message.success('修改成功');
        return;
      }
      message.error('修改失败' + mes.msg);
    } catch (error) {
      message.error('异常: 修改失败');
    }
  }


  useEffect(() => {
    getUserInfo();
  }, []);
  // 页面渲染逻辑
  return (
    <>
      <Space style={{borderRadius: '20px', backgroundColor: '#ffffff'}}>
        <Avatar
          style={{margin: '50px'}}
          size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
          icon={<AntDesignOutlined/>}
          src={userInfo?.avatarUrl}
        />
        <Descriptions
          items={[
            {
              key: '1',
              label: (
                <Text strong style={{lineHeight: '32px'}}>
                  用户名称
                </Text>
              ),
              children: (
                <Text strong style={{lineHeight: '32px'}}>
                  {userInfo?.nickname}
                </Text>
              ),
              span: 3,
            },
            {
              key: '2',
              label: (
                <Text strong style={{lineHeight: '32px'}}>
                  账户类型
                </Text>
              ),
              children: (
                <Text strong style={{lineHeight: '32px'}}>
                  {userRole}
                </Text>
              ),
              span: 2,
            },
            {
              key: '3',
              label: (
                <Text strong style={{lineHeight: '32px'}}>
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
        <Form layout="vertical" onFinish={handleSubmitPassword} initialValues={{remember: false}}>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{required: true, message: '请输入当前密码!'}]}
          >
            <Input.Password onChange={handlePasswordChange} name="oldPassword"/>
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{required: true, message: '请输入新密码!'}]}
          >
            <Input.Password onChange={handlePasswordChange} name="newPassword"/>
          </Form.Item>
          <Form.Item
            name="checkPassword"
            label="确认密码"
            rules={[{required: true, message: '请确认密码!'}]}
          >
            <Input.Password onChange={handlePasswordChange} name="checkPassword"/>
          </Form.Item>
        </Form>
      </Modal>

      <Divider orientation="left">您的基础信息</Divider>

      <Space style={{borderRadius: '12px'}}>
        <List loading={initLoading} size="large" style={{width: '94vw'}}>
          <UserInfoItem
            label="可用余额"
            paragraph={<Paragraph>{userInfo?.availableBalance}</Paragraph>}
          />
          <UserInfoItem
            label="代金券"
            paragraph={<Paragraph>{userInfo?.voucherBalance}</Paragraph>}
          />
          <UserInfoItem
            label="现金"
            paragraph={<Paragraph>{userInfo?.cashBalance}</Paragraph>}
          />
          <UserInfoItem
            label="API KEY"
            paragraph={
              <Paragraph
                editable={{
                  tooltip: 'MoonshotAI的KEY',
                  autoSize: {maxRows: 5, minRows: 1},
                  onChange: (value) => {
                    const updatedState = {role: value}
                    handleSubmitApiKey(updatedState);
                    return updatedState
                  },
                  text: formUserApiKey?.role || userInfo?.role,
                }}
              >
               <>
                 {"****************"}
               </>
              </Paragraph>
            }
          />
          <UserInfoItem
            label="昵称"
            paragraph={
              <Paragraph
                editable={{
                  tooltip: '点击编辑',
                  autoSize: {maxRows: 5, minRows: 1},
                  onChange: (value) => {
                    const updatedState = {...formPasswordData, nickname: value}
                    handleSubmitUserInfo(updatedState);
                    return updatedState
                  },
                  text: formUserInfoData?.nickname || userInfo?.nickname,
                }}
              >
                {formUserInfoData?.nickname || userInfo?.nickname}
              </Paragraph>
            }
          />
          <UserInfoItem
            label="账号"
            paragraph={
              <Paragraph
                editable={{
                  tooltip: '点击编辑',
                  autoSize: {maxRows: 5, minRows: 1},
                  onChange: (value) => {
                    const updatedState = {nickname: "", userAccount: value, profile: ""}
                    handleSubmitUserInfo(updatedState);
                    return updatedState
                  },
                  text: formUserInfoData?.userAccount || userInfo?.account,
                }}
              >
                {formUserInfoData?.userAccount || userInfo?.account}
              </Paragraph>
            }
          />
          <UserInfoItem
            label="简介"
            paragraph={
              <Paragraph
                editable={{
                  tooltip: '点击编辑',
                  autoSize: {maxRows: 5, minRows: 1},
                  onChange: (value) => {
                    const updatedState = {profile: value, ...formPasswordData}
                    handleSubmitUserInfo(updatedState);
                    return updatedState
                  },
                  text: formUserInfoData?.profile || userInfo?.profile,
                }}
              >
                {formUserInfoData?.profile || userInfo?.profile}
              </Paragraph>
            }
          />
          <UserInfoItem
            label="账户类型"
            paragraph={<Paragraph>{userRole}</Paragraph>}
          />
          <UserInfoItem
            label="创建时间"
            paragraph={<Paragraph>{userInfo?.createTime}</Paragraph>}
          />
        </List>
      </Space>
    </>
  )
    ;
};
export default UserInfo;
