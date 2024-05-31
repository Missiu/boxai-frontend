import {
    Alert,
    Button,
    Card,
    Divider,
    Flex,
    FloatButton,
    Form,
    Input,
    Layout,
    Menu,
    message,
    Modal,
    Slider,
    Spin,
    Switch,
    theme,
    Typography,
} from 'antd';
import React, {useEffect, useState} from 'react';
import {useModel, useNavigate} from "@@/exports";
import {getChartInfo, listChartInfo, updateChartInfo} from "@/services/boxai/dataChartController";
import ReactMarkdown from 'react-markdown';
import EChartsReact from "echarts-for-react";
import {UploadOutlined} from '@ant-design/icons';
import {sharePosts} from '@/services/boxai/postController';
import Search from "antd/es/input/Search";
import {flushSync} from "react-dom";
import './menu.css'

const {Content, Sider} = Layout;
const {Title, Paragraph, Text} = Typography;

const History: React.FC = () => {

        /**
         * 数据展示
         * 1. 获取chart数据
         * 2. 菜单处理
         * 3. 搜索框
         */

        /**
         * 全局参数获取用户和列表信息
         */
        const {initialState, setInitialState} = useModel('@@initialState');
        // 图表分页查询的结果列表
        const [chartPageList, setChartPageList] = useState<API.PageUniversalDataChartsVO>();
        // 如果列表信息不存在
        // 分页信息请求
        const [searchParams] = useState<API.PageModel>();
        // 图表列表信息请求
        const [formChartListData, setFormChartListData] = useState<API.ChartQueryDTO>({});
        const getChartListData = async () => {
            try {
                // 全局参数里获取用户信息，作为查询参数的一部分
                setFormChartListData({userId: initialState?.currentUser?.id})
                const res = await listChartInfo({pageModel: {...searchParams}}, {...formChartListData});
                if (res.code === 200) {
                    setChartPageList(res.data)
                    // 同步回调，保存列表参数
                    flushSync(() => {
                        setInitialState((s: any) => {
                            return {
                                ...s,
                                chartList: res.data
                            }
                        })
                    });
                } else {
                    message.error('获取历史数据失败' + res.msg);
                }
            } catch (error) {
                message.error('异常: 获取数据失败');
            }
        };


        /**
         * 菜单处理
         */
        const [status, setStatus] = useState(null);
        // 菜单点击
        // 历史菜单击处理函数
        const navigate = useNavigate();
        // 从redis获取chart信息
        const getChartInfoByRedis = async (id: number) => {
            const res = await getChartInfo({id: id})
            if (res.code === 200) {
                console.log(res.data)
                return res.data?.status as string
            } else {
                message.error('获取失败' + res.msg);
            }
        }
    const [loading, setLoading] = useState(false);
        const handleMenuClick = (key: string) => {
            getChartInfoByRedis(parseInt(key)).then(r =>
                {setStatus(r)
                    message.success("当前状态: "+ r)
                }
            )
            console.log(key);
            console.log(loading);
            // 将key作为状态传递给新位置
            navigate(`/history/${key}`);
            localStorage.setItem('chartId', key);
        };
        const chartId = localStorage.getItem('chartId');
        // 菜单项数据填充
        const items = chartPageList?.records?.map((item: any) => {
            return (
                <Menu.Item
                    className={`my-item ${item.highlight ? 'fade-in-out' : ''}`}
                    style={{padding: '10px', borderRadius: '4px'}}
                    key={item.id}
                    onClick={(key) => {
                        handleMenuClick(key.key)
                    }}
                >
                    {item.generationName}
                </Menu.Item>
            )
        });


        /**
         * 搜索框处理,搜索条件：ChartQueryDTO
         * Long id 、String goalDescription 、 String generationName 、Long userId
         */
            // 图表信息类型
        interface chartType {
            id: number;
            goalDescription: string
            generationName: string
            aiTokenUsage: number
            userId: number
            codeComments: string
            rawData: string
            codeProfileDescription: string
            codeEntities: string
            codeApis: string
            codeExecution: string
            codeSuggestions: string
            codeNormRadar: string
            codeNormRadarDescription: string
            codeTechnologyPie: string
            codeCatalogPath: string
            createTime: string
            updateTime: string
            isDelete: number
        }

        // 搜索排序
        const mergeAndHighlight = (list1: chartType[], list2: chartType[]) => {
            // 先将list2的元素添加到结果中，然后过滤掉list1中在list2中已存在的元素
            const merged = [...list2, ...list1.filter(item => !list2.some(searchItem => searchItem.id === item.id))];
            // 对合并后的数组进行映射，为在list2中存在的元素添加highlight属性
            return merged.map(item => ({
                ...item,
                highlight: list2.some(searchItem => searchItem.id === item.id),
            }));
        };
        // 开始搜索
        const handleSearch = async (value: string) => {
            let formSearchData = {id: 0, generationName: "", goalDescription: "", userId: initialState?.currentUser?.id};
            // 如果是数字，尝试使用id搜索
            const parsedId = parseInt(value, 10);
            if (!isNaN(parsedId)) {
                formSearchData = {
                    id: parsedId,
                    generationName: "",
                    goalDescription: "",
                    userId: initialState?.currentUser?.id
                };
            } else {
                // 否则作为 generationName 或者 goalDescription搜索
                formSearchData = {
                    id: 0,
                    generationName: value,
                    goalDescription: value,
                    userId: initialState?.currentUser?.id
                };
            }
            // 开始搜索
            const res = await listChartInfo({pageModel: {...searchParams}}, {...formSearchData})
            if (res.code === 200) {
                // 暂时修改图表分页查询的结果列表
                const newMergedList = mergeAndHighlight(chartPageList?.records as chartType[], res.data?.records as chartType[])
                setChartPageList({records: newMergedList})
                message.success('搜索成功')
            } else {
                message.error('搜索失败' + res.msg)
            }
        };


        // 列表信息渲染
        const [charInfo, setChartInfo] = useState<API.ChartUpdateDTO>();
        //

        const handleSubmitChartInfo = async (charInfo: API.ChartUpdateDTO) => {
            const res = await updateChartInfo({...charInfo})
            if (res.code === 200) {
                setChartInfo(charInfo)
                message.success('更新成功');
            } else {
                message.error('更新失败' + res.msg);
            }
        };

        // 数据扩张
        const [rows, setRows] = useState(2);
        const [expanded, setExpanded] = useState(false);

        // 模态框可视化
        const [modalVisible, setModalVisible] = useState(false);
        const [description, setDescription] = useState(''); // 存储用户输入的描述
        // 处理输入框变化的函数
        const handleDescriptionChange = (e: any) => {
            setDescription(e.target.value);
        };
        const handleShare = async (value: API.PostAddDTO) => {
            const res = await sharePosts({...value})
            if (res.code === 200) {
                message.success('分享成功');
                setModalVisible(false)
            } else {
                message.error('分享失败' + res.msg);
            }
        };


        const [selectedChart, setSelectedChart] = useState<API.UniversalDataChartsVO>();


        useEffect(() => {
            if (!sessionStorage.getItem('reloaded')) {
                sessionStorage.setItem('reloaded', 'true');
                window.location.reload();
            }
            getChartListData()
        }, []);


        function parseCodeNorm(code: string) {
            if (code) {
                try {
                    if (code) {
                        return JSON.parse(code ?? '{}');
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


        // const [codeTechnologyPie, setCodeTechnologyPie] = useState(null);
        // const [codeEntities, setCodeEntities] = useState(null);

        useEffect(() => {
            setChartPageList(initialState?.chartList)
            if (!initialState?.chartList) {
                getChartListData()
                console.log(loading)
            }
            const fetchData = async () => {
                if (chartId) {
                    const chart = initialState?.chartList?.records?.find((chart: any) => String(chart.id) === chartId);
                    setSelectedChart(chart)
                    console.log(selectedChart)
                    if (chart) {
                        if (status === null) {
                            setLoading(false)
                        } else if (status === 'QUEUEING' || status === 'EXECUTING') {
                            setLoading(true)
                        } else if (status === 'COMPLETED') {
                            setLoading(false)
                        } else {
                            setLoading(false)
                            return
                        }
                    }
                }
            }
            fetchData();

        }, [chartId, initialState, status]);

        const renderContent = () => {
            if (status === "FAILED") {
                return (
                    <>
                        {/*前言*/}
                        <Typography>
                            <Card>
                                <Paragraph
                                    style={{textAlign: 'left'}}
                                    editable={{
                                        onChange: async (value: string) => {
                                            await handleSubmitChartInfo({
                                                ...charInfo,
                                                generationName: value,
                                                id: selectedChart?.id
                                            });
                                        },
                                        text: selectedChart?.generationName || charInfo?.generationName,
                                        tooltip: '编辑',
                                    }}
                                >
                                    <Text strong>分析名称
                                        : {charInfo?.generationName || selectedChart?.generationName}</Text>
                                </Paragraph>
                                <Paragraph
                                    style={{textAlign: 'left'}}
                                    editable={{
                                        onChange: async (value: string) => {
                                            await handleSubmitChartInfo({
                                                ...charInfo,
                                                goalDescription: value,
                                                id: selectedChart?.id
                                            });
                                        },
                                        text: selectedChart?.goalDescription || charInfo?.goalDescription,
                                        tooltip: '编辑',
                                    }}
                                >
                                    <Text strong>分析目标
                                        : {charInfo?.goalDescription || selectedChart?.goalDescription}</Text>
                                </Paragraph>
                                <Paragraph style={{textAlign: 'left'}}>
                                    <Text strong>消耗token : {selectedChart?.aiTokenUsage}</Text>
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
                                        {selectedChart?.rawData}
                                    </Paragraph>
                                </Paragraph>
                            </Card>
                        </Typography>

                        <Divider orientation="center">分析结果如下</Divider>
                        <div>分析失败!</div>
                    </>
                )
            }else {
                const codeEntities = parseCodeNorm(selectedChart?.codeEntities as string)
                const codeTechnologyPie = parseCodeNorm(selectedChart?.codeTechnologyPie as string)
                const codeNormRadar = parseCodeNorm(selectedChart?.codeNormRadar as string)
                return (
                    <>
                        {/*前言*/}
                        <Typography>
                            <Card>
                                <Paragraph
                                    style={{textAlign: 'left'}}
                                    editable={{
                                        onChange: async (value: string) => {
                                            await handleSubmitChartInfo({
                                                ...charInfo,
                                                generationName: value,
                                                id: selectedChart?.id
                                            });
                                        },
                                        text: selectedChart?.generationName || charInfo?.generationName,
                                        tooltip: '编辑',
                                    }}
                                >
                                    <Text strong>分析名称
                                        : {charInfo?.generationName || selectedChart?.generationName}</Text>
                                </Paragraph>
                                <Paragraph
                                    style={{textAlign: 'left'}}
                                    editable={{
                                        onChange: async (value: string) => {
                                            await handleSubmitChartInfo({
                                                ...charInfo,
                                                goalDescription: value,
                                                id: selectedChart?.id
                                            });
                                        },
                                        text: selectedChart?.goalDescription || charInfo?.goalDescription,
                                        tooltip: '编辑',
                                    }}
                                >
                                    <Text strong>分析目标
                                        : {charInfo?.goalDescription || selectedChart?.goalDescription}</Text>
                                </Paragraph>
                                <Paragraph style={{textAlign: 'left'}}>
                                    <Text strong>消耗token : {selectedChart?.aiTokenUsage}</Text>
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
                                        {selectedChart?.rawData}
                                    </Paragraph>
                                </Paragraph>
                            </Card>
                        </Typography>

                        <Divider orientation="center">分析结果如下</Divider>

                        <Flex gap="small" vertical>
                            <Spin tip="Loading..." spinning={loading}>
                                {loading ? (
                                    <Alert
                                        message="Alert message title"
                                        description="Further details about the context of this alert."
                                        type="info"
                                    />
                                ) : (
                                    <>
                                        {/*项目简介*/}
                                        {selectedChart?.codeProfileDescription && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeProfileDescription: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeProfileDescription || selectedChart.codeProfileDescription,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目简介
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeProfileDescription || selectedChart.codeProfileDescription}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目注释*/}
                                        {selectedChart?.codeComments && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeComments: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeComments || selectedChart?.codeComments,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目核心代码注释
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeComments || selectedChart.codeComments}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目技术栈*/}
                                        {selectedChart?.codeTechnologyPie && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeTechnologyPie: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeTechnologyPie || selectedChart?.codeTechnologyPie,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目技术栈分布
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        {codeTechnologyPie !== '{}' ? (
                                                            <EChartsReact
                                                                option={JSON.parse(selectedChart?.codeTechnologyPie)}/>
                                                        ) : (
                                                            <ReactMarkdown>{charInfo?.codeTechnologyPie || selectedChart?.codeTechnologyPie}</ReactMarkdown>
                                                        )}
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目运行*/}
                                        {selectedChart?.codeExecution && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeExecution: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeExecution || selectedChart?.codeExecution,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目运行
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeExecution || selectedChart.codeExecution}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目实体关系*/}
                                        {selectedChart?.codeEntities && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeEntities: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeEntities || selectedChart?.codeEntities,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目实体关系图
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        {codeEntities !== '{}' ? (
                                                            <EChartsReact option={codeEntities}/>
                                                        ) : (
                                                            <ReactMarkdown>{charInfo?.codeEntities || selectedChart?.codeEntities}</ReactMarkdown>
                                                        )}
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目API*/}
                                        {selectedChart?.codeApis && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeApis: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeApis || selectedChart?.codeApis,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目第三方API调用情况
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeApis || selectedChart?.codeApis}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*规范评分说明*/}
                                        {selectedChart?.codeNormRadarDescription && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeNormRadarDescription: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeNormRadarDescription || selectedChart?.codeNormRadarDescription,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    规范评分说明
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeNormRadarDescription || selectedChart.codeNormRadarDescription}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目雷达评分图*/}
                                        {selectedChart?.codeNormRadar && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeNormRadar: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeNormRadar || selectedChart?.codeNormRadar,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目雷达评分图
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        {codeNormRadar !== '{}' ? (
                                                            <EChartsReact option={codeNormRadar}/>
                                                        ) : (
                                                            <ReactMarkdown>{charInfo?.codeNormRadar || selectedChart?.codeNormRadar}</ReactMarkdown>
                                                        )}
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                        {/*项目优化建议*/}
                                        {selectedChart?.codeSuggestions && (
                                            <Typography style={{textAlign: 'left'}}>
                                                <Title
                                                    level={3}
                                                    editable={{
                                                        onChange: async (value: string) => {
                                                            await handleSubmitChartInfo({
                                                                ...charInfo,
                                                                codeSuggestions: value,
                                                                id: selectedChart?.id
                                                            });
                                                        },
                                                        text: charInfo?.codeSuggestions || selectedChart.codeSuggestions,
                                                        tooltip: '编辑',
                                                    }}
                                                >
                                                    项目优化建议
                                                </Title>
                                                <Paragraph>
                                                    {/*{selectedChart.codeProfile}*/}
                                                    <Card style={{backgroundColor: '#fafafa'}}>
                                                        <ReactMarkdown>{charInfo?.codeSuggestions || selectedChart.codeSuggestions}</ReactMarkdown>
                                                    </Card>
                                                </Paragraph>
                                            </Typography>
                                        )}

                                    </>
                                )}

                            </Spin>
                        </Flex>

                        <FloatButton onClick={() => setModalVisible(true)} icon={<UploadOutlined/>}/>
                        {/* 模态框 */}
                        <Modal
                            title="分享"
                            open={modalVisible}
                            onOk={() => handleShare({
                                content: description,
                                chartId: selectedChart?.id
                            })}
                            onCancel={() => setModalVisible(false)}
                            okText="上传"
                            cancelText="取消"
                        >
                            <Form
                                layout="vertical"
                                onFinish={() => handleShare({
                                    content: description,
                                    chartId: selectedChart?.id
                                })}
                            >
                                <Form.Item
                                    name="description"
                                    label="描述信息"
                                    rules={[{required: true, message: '请输入描述信息!'}]}
                                >
                                    <Input.TextArea
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        placeholder="请输入描述信息"
                                        rows={4}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                );
            }

        };

        const {
            token: {colorBgContainer, borderRadiusLG},
        } = theme.useToken();

        return (
            <Layout hasSider>

                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 24,
                        top: '10%',
                        bottom: 0,
                        borderRadius: '8px',
                        backgroundColor: 'white',
                    }}
                >

                    <div className="demo-logo-vertical"/>
                    <Button
                        size="large"
                        style={{width: '100%', border: 'none', margin: '8px 0'}}
                        type={'primary'}
                    >
                        历史记录
                    </Button>

                    <div style={{padding: '12px 0'}}>
                        <Search placeholder="搜索" allowClear onSearch={handleSearch} onClick={getChartListData}/>
                    </div>

                    <Menu
                        theme="light"
                        mode="inline"
                        // onClick={()=> getChartInfoByRedis(parseInt(chartId))}
                        defaultSelectedKeys={[chartId as string || localStorage.getItem('chartId') || '']}
                        // onClick={({key}) => handleMenuClick(key)} // 绑定点击事件处理
                        // items={items}
                    >
                        {items}
                    </Menu>
                </Sider>

                <Layout style={{marginLeft: 200}}>
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

                </Layout>
            </Layout>
        );
    }
;

export default History;
