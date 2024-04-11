import { genChartByAiUsingPost } from '@/services/boxai/chartController';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
// import {Simulate} from "react-dom/test-utils";

// 异步函数

const Chart: React.FC = () => {
  const [chart, setChart] = useState<API.ChatResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, setOption] = useState<any>();
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const params = {
      ...values,
      file: undefined,
    };
    // todo 对接后端上传数据
    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      }
      console.log(res);
      const chartOption = JSON.parse(res.data?.genChart ?? '');
      if (!chartOption) {
        throw new Error('解析错误');
      } else {
        setChart(res.data);
        setOption(chartOption);
      }
      message.success('上传成功');
    } catch (e: any) {
      message.error('上传失败');
    }
    setSubmitting(false);
  };

  return (
    <div className="add_chart">
      <Form name="add_chart" onFinish={onFinish} initialValues={{}}>
        <Form.Item
          name="goal"
          label="分析目标"
          rules={[{ required: true, message: '目标为必填项!' }]}
        >
          <TextArea rows={1} placeholder="请输入侧重点：如何快速运行此项目？" />
        </Form.Item>
        <Form.Item name="name" label="分析名称">
          <Input placeholder="默认为传入文件名称" />
        </Form.Item>
        <Form.Item
          name="file"
          label="文件"
          // rules={[{required:true, message: '请上传文件!'}]}
        >
          <Upload name="file">
            <Button icon={<UploadOutlined />}>点击上传项目文件</Button>
          </Upload>
        </Form.Item>
        <Form.Item label="文件夹">
          <Form.Item name="files" noStyle>
            <Upload.Dragger name="files" directory={true} showUploadList={true}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击上传文件夹</p>
              {/*<p className="ant-upload-hint">支持批量上传</p>*/}
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
              分析
            </Button>
            <Button htmlType="reset">重置</Button>
          </Space>
        </Form.Item>
      </Form>
      <div>结果: {chart?.genChart}</div>
    </div>
  );
};
export default Chart;
