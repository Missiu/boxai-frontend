import React from 'react';
import {Row, Col, Typography, List} from 'antd';

const {Title, Paragraph, Text} = Typography;


const UserInfoItem = ({label,paragraph }) => (
    <List.Item >
        <Row
            style={{
                borderRadius: '12px',
                marginTop: '8px',
                backgroundColor: '#ffffff',
                padding: '8px',
                width: '100%',
                margin: '0 auto',
                alignItems: 'center', // 使内容在垂直方向上居中
            }}
        >
            <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>
                    {label}
                </Title>
            </Col>
            <Col span={8}></Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paragraph style={{ margin: 0 }}>
                    <Text strong >
                        {paragraph}
                    </Text>
                </Paragraph>
            </Col>
        </Row>
    </List.Item>
);

export default UserInfoItem;
