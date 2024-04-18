import {
  genChartByAiUsingPost,
  genFilesChartByAiUsingPost,
} from '@/services/boxai/chartController';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, Space, Upload, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
// import {Simulate} from "react-dom/test-utils";

// 异步函数

const Chart: React.FC = () => {
  const [chart, setChart] = useState<API.ChatCompletionResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
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
      let res;
      if (values.file && values.file.file) {
        console.log(values);
        console.log(params);
        res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
        if (!res?.data) {
          message.error('分析失败');
        }

        console.log(res.data);
        console.log(1111111);
        setChart(res.data);
        message.success('上传成功');
        setSubmitting(false);
      } else {
        console.log(values);
        // 如果有多个文件
        const fileList = values.files.fileList; // 获取文件列表数组
        console.log(fileList);

        const originFileObjs = fileList.map((file: any) => file.originFileObj); // 提取每个文件对象的 originFileObj 属性并添加到数组中
        const p = {
          // ...values,
          genName: values.genName,
          goal: values.goal,
          files: originFileObjs,
        };

        console.log(originFileObjs);
        console.log(p);
        res = await genFilesChartByAiUsingPost(p);
        console.log(222222);
        console.log(res);
        setChart(res.data);
        message.success('上传成功');
        setSubmitting(false);
      }
    } catch (e: any) {
      message.error('上传失败');
      setSubmitting(false);
    }
  };

  return (
    <div className="add_chart">
      <Card>
        <Form name="add_chart" onFinish={onFinish} initialValues={{}}>
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '目标为必填项!' }]}
          >
            <TextArea rows={1} placeholder="请输入侧重点：如何快速运行此项目？" />
          </Form.Item>
          <Form.Item name="genName" label="分析名称">
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
              <Upload.Dragger
                name="files"
                directory={true}
                showUploadList={true}
                // multiple={true}
                // headers={{authorization: 'authorization-text'}}
              >
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
      </Card>
      <div>
        <Divider orientation="center">分析结果</Divider>
        <Card>
          <ReactMarkdown>{chart?.genChart}</ReactMarkdown>
        </Card>
      </div>
    </div>
  );
};
export default Chart;
