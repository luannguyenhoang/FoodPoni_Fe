import React, {useEffect, useState} from 'react';
import {Divider, Image, Modal, notification, Rate} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import FileUploads from "./file-upload";
import {RootState} from "../stores";
import {setShowModalRate} from "../stores/rate.reducer";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";
import {AxiosResponse} from "axios";
import {accessToken, apiWithToken} from "../utils/axiosConfig.ts";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {Page} from "../models/Page";
import {getRateByCustomerAndOrderId} from "@/api/rate.query";

const RateRows = ({orderId}: { orderId: string }) => {

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const showModalRate: boolean = useSelector((state: RootState) => state.rate.showModalRate);

    const [rates, setRates] = useState<RateAPIResponse[]>([]);

    const getRates = (): void => {
        if (refreshToken) {
            getRateByCustomerAndOrderId(orderId, {refreshToken: refreshToken})
                .then(res => {
                    setRates(res.content);
                })
                .catch(res => {
                    notification.open({
                        type: 'error',
                        message: 'Đánh giá',
                        description: res.message
                    });
                });
        }
    }

    useEffect((): void => {
        getRates();
    }, []);

    const handleModalClose = (): void => {
        dispatch(setShowModalRate(false));
    }

    return (
        <Modal title="Đánh giá của bạn" open={showModalRate} footer={null} onCancel={handleModalClose}
               style={{userSelect: 'none'}}>
            <div style={{padding: '20px 0'}}>
                {rates.length != 0 ? rates.map((rate, index) => (
                    <div key={index}>
                        {/* Render rate number */}
                        <div><Rate value={rate.rate}/></div>
                        {/* Render message string */}
                        <div><p style={{fontSize: '20px', margin: '10px 0'}}>{rate.message}</p></div>
                        {/* Render images */}
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                            {rate.images && rate.images.map((url, index) => (
                                <div key={index} style={{marginRight: '10px', marginBottom: '10px'}}>
                                    <Image src={url} alt={`Image ${index}`} width={100} height={60}
                                           style={{objectFit: 'cover', cursor: 'pointer'}}/>
                                </div>
                            ))}
                        </div>
                        {/* Render product thumbnail and name */}
                        <div style={{
                            display: 'flex', alignItems: 'center', marginBottom: '10px', border: '1px solid #e0e0e0',
                            padding: '2px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '5px',
                        }}>
                            {/* Render product thumbnail */}
                            <div style={{
                                marginRight: '10px',

                            }}>
                                <Image src={rate.thumbnail} alt={`Product Thumbnail ${index}`} width={30}
                                       height={30}/>
                            </div>
                            {/* Render product name */}
                            <div>
                                <p style={{fontSize: '16px', fontWeight: 'bold', margin: '0'}}>{rate.name}</p>
                            </div>
                        </div>
                        <Divider/>
                    </div>
                )) : (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <p>Không có đánh giá</p>
                    </div>
                )}
            </div>
            <FileUploads/>
        </Modal>
    );
};

export default RateRows;