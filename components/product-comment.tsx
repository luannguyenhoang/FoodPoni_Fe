import React from 'react';
import {LikeOutlined, MessageOutlined, StarOutlined} from '@ant-design/icons';
import {Avatar, Card, Image, List, Rate, Space} from 'antd';
import {server} from "../utils/server";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";

const IconText = ({icon, text}: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

const ProductComment = ({data,isLoading}: { data: RateAPIResponse[], isLoading: boolean }) => (
    <Card size='small' title='Đánh giá'>
        <List
            loading={isLoading}
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3,
            }}
            dataSource={data}
            renderItem={(item, index) => (
                <List.Item
                    key={index}
                    actions={[
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o"/>,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o"/>,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message"/>,
                    ]}
                    // extra={
                    //     // <img
                    //     //     width={272}
                    //     //     alt="logo"
                    //     //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    //     // />
                    // }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={server + item.avatar} className="w-[40px] h-[40px]"/>}
                        title={<a href={item.username}>{item.username} <br/>
                            <Rate allowHalf disabled value={item.rate}/></a>}
                    />
                    <div className="text-[16px] font-normal text-[#333] mb-[10px]">{item.message}</div>
                    {/* Render images */}
                    <div className="flex flex-wrap">
                        {item.images && item.images.map((url, index) => (
                            <div key={index} className="mr-[10px] mb-[10px]">
                                <Image src={url} alt={`Image ${index}`} width={100} height={60}
                                       className="object-cover cursor-pointer"/>
                            </div>
                        ))}
                    </div>
                </List.Item>
            )}
        />
    </Card>
);

export default ProductComment;