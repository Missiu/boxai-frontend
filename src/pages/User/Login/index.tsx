import {Footer} from '@/components';
import {userLogin, userLoginInfo} from '@/services/boxai/userController';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormText} from '@ant-design/pro-components';
import {Helmet, history, Link, useModel} from '@umijs/max';
import {message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({token}) => {
    return {
        action: {
            marginLeft: '8px',
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: '24px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'color 0.3s',
            '&:hover': {
                color: token.colorPrimaryActive,
            },
        },
        lang: {
            width: 42,
            height: 42,
            lineHeight: '42px',
            position: 'fixed',
            right: 16,
            borderRadius: token.borderRadius,
            ':hover': {
                backgroundColor: token.colorBgTextHover,
            },
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        },
    };
});

const Login: React.FC = () => {
    const [type, setType] = useState<string>('account');
    const {setInitialState} = useModel('@@initialState');
    const {styles} = useStyles();
    /**
     * 异步获取用户信息并更新初始状态。
     * 首先调用 userLoginInfo 函数获取用户信息，如果获取到信息，则将该信息更新到初始状态中的 currentUser 属性。
     * @returns 无返回值。
     */
    const fetchUserInfo = async () => {
        // 获取用户登录信息
        const userInfo = await userLoginInfo();
        // 当 userInfo 不为空时，同步更新初始状态
        try {
            if (userInfo.code === 200){
                flushSync(() => {
                    // 更新初始状态，将 userInfo 合并到 currentUser 中
                    setInitialState((s) => ({
                        ...s,
                        currentUser: userInfo.data,
                    }));
                });
            }else {
                message.error("获取用户信息失败:"+userInfo.msg);
            }
        }catch (error){
            message.error("获取用户信息失败");
        }
    };

    /**
     * 处理用户登录提交的函数。
     * @param values 包含用户登录信息的对象，符合API.UserLoginDTO接口定义。
     * @returns 无返回值。
     */
    const handleSubmit = async (values: API.UserLoginDTO) => {
        try {
            // 发起登录请求
            const msg = await userLogin(values);
            if (msg.code === 200) {
                // 登录成功，将 token 存储在会话中
                sessionStorage.setItem('token', msg.data ?? '');
                // localStorage.setItem('token', msg.data ?? '');
                // 获取用户信息
                await fetchUserInfo();
                // 重定向到登录前的页面或默认首页
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                message.success('登录成功');
                return;
            }
            // 登录失败显示错误信息
            message.error("登录失败:"+msg.msg);
        } catch (error) {
            // 处理登录过程中的异常
            message.error('异常: 登录失败'+error);
        }
    };

    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {'登录'}- {Settings.title}
                </title>
            </Helmet>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src="/logo.svg"/>}
                    title="基于文本生成式AI大模型的Github源代码分析及可视化平台"
                    subTitle={
                        '面对广大开发者和技术爱好者的AI开发工具，可以进一步降低理解源代码的门槛，增加开发效率'
                    }
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.UserLoginDTO);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: '账户密码登录',
                            },
                        ]}
                    />
                    {type === 'account' && (
                        <>
                            <ProFormText
                                // 对应请求参数
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined/>,
                                }}
                                placeholder={'请输入用户名'}
                                rules={[
                                    {
                                        required: true,
                                        message: '用户名是必填项！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                // 对应请求参数
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                ]}
                            />
                        </>
                    )}

                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <Link to={'/user/register'}>注册账号</Link>
                    </div>
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Login;
