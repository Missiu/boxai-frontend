import {Footer} from '@/components';
import {userLoginInfo, userRegister} from '@/services/boxai/userController';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormText} from '@ant-design/pro-components';
import {Helmet, history} from '@umijs/max';
import {message, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useState} from 'react';
import Settings from '../../../../config/defaultSettings';
import {flushSync} from "react-dom";
import {useModel} from "@@/exports";

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

const Register: React.FC = () => {
    const [type, setType] = useState<string>('account');
    const {styles} = useStyles();
    const {setInitialState} = useModel('@@initialState');

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
     * 提交注册表单的处理函数
     * @param values 包含用户注册信息的对象，符合API.UserRegisterDTO接口定义
     * @returns Promise<void> 无返回值的Promise
     */
    const handleSubmit = async (values: API.UserRegisterDTO) => {
        const {userPassword, checkPassword} = values;

        // 校验用户输入的密码和确认密码是否一致
        if (userPassword !== checkPassword) {
            message.error('两次输入的密码不一致');
            return;
        }

        try {
            // 发起注册请求
            const msg = await userRegister(values);
            if (msg.code === 200) {
                message.success('注册成功');
                // 设置token
                sessionStorage.setItem('token', msg.data ?? '');
                await fetchUserInfo();
                // 重定向到登录前的页面或默认首页
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                message.success('登录成功');
                return;
            }
            // 注册失败的处理
            message.error('注册失败: ' + msg.msg);
        } catch (error) {
            // 处理注册过程中可能出现的异常
            message.error('异常: 注册失败');
        }
    };

    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {'注册'}- {Settings.title}
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
                    submitter={{searchConfig: {submitText: '注册',}}}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.UserRegisterDTO);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: '用户注册',
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
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '长度不能小于 8',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                // 对应请求参数
                                name="checkPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined/>,
                                }}
                                placeholder={'请再次输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '长度不能小于 8',
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
            <Footer/>
        </div>
    );
};
export default Register;
