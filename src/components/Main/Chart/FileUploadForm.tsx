import React from 'react';
import {Button, Col, Form, Input, Row, Typography} from 'antd';

const { Text } = Typography;

interface Props {
    onFinish: (values: any) => void;
    submitting: boolean;
    extraComponent?: React.ReactNode;
}

const FileUploadForm = ({ onFinish, submitting,extraComponent }: Props) => {
    return (
        <Form onFinish={onFinish}>
            <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                <Text strong>分析名称：</Text>
            </Typography>
            <Form.Item style={{ margin: '12px 12px' }} name="generationName">
                <Input placeholder="输入分析名称" />
            </Form.Item>

            <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                <Text strong>分析目标：</Text>
            </Typography>
            <Form.Item style={{ margin: '12px 12px' }} name="goalDescription">
                <Input placeholder="输入分析目标" />
            </Form.Item>

            <Typography style={{ textAlign: 'left', marginBottom: '12px' }}>
                <Text strong>上传文件：</Text>
            </Typography>
            {extraComponent}

            <Form.Item style={{ margin: '12px 12px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Button
                            type="primary"
                            block
                            size="large"
                            htmlType="submit"
                            loading={submitting}
                            disabled={submitting}
                        >
                            提交
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button block size="large" htmlType="reset">
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
};

export default FileUploadForm;
