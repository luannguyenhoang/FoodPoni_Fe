import {Card, Checkbox, Col, Input, InputNumber, Row} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem, ICart, ICartItem, setNote, setQuantity} from "../stores/cart.reducer";
import {RootState} from "../stores";
const {TextArea} = Input;

const OrderItems = () => {

    const dispatch = useDispatch();

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const onChangeQuantity = (id: string, retailerId: string, value: number): void => {
        const payload: {id: string, retailerId: string, value: number} = {id, retailerId, value};
        dispatch(setQuantity(payload));
    };

    const onChangeNote = (itemId: string, retailerId: string, note: string): void => {
        dispatch(setNote({id: itemId, retailerId, note}));
    };

    return (
        <div>
            <Card style={{marginBottom: "16px"}}>
                <Row>
                    <Col flex='2%'>
                        <Checkbox></Checkbox>
                    </Col>
                    <Col flex='40%'>Tất cả</Col>
                    <Col flex='10%'>Đơn giá</Col>
                    <Col flex='10%'>Số lượng</Col>
                    <Col flex='10%'>Thành tiền</Col>
                    <Col flex='26%'>Ghi chú</Col>
                    <Col flex='2%'>
                        <DeleteOutlined/>
                    </Col>
                </Row>
            </Card>
            {
                carts.map((cart: ICart) => (
                    <Card key={cart.id}>
                        {cart.cartItems.map((item: ICartItem, index: number) => (
                            <Row key={index} style={{margin: '16px 0', alignItems: 'center'}}>
                                <Col flex='2%'>
                                    <Checkbox checked></Checkbox>
                                </Col>
                                <Col flex='40%'>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div>
                                            <img src={item.thumbnail} style={{width: "100px"}} alt="Product"/>
                                        </div>
                                        <div style={{marginLeft: '16px'}}>{item.name}</div>
                                    </div>
                                </Col>
                                <Col flex='10%'>${item.price}</Col>
                                <Col flex='10%'>
                                    <InputNumber min={1}
                                                 max={20}
                                                 style={{maxWidth: '70px'}}
                                                 defaultValue={1}
                                                 value={item.quantity}
                                                 onChange={(value: number | null) => onChangeQuantity(item.id, item.retailer.id ?? '', value!)}/>
                                </Col>
                                <Col flex='10%'>${item.price * item.quantity}</Col>
                                <Col flex='26%'>
                                    <TextArea
                                        placeholder="Note"
                                        value={item.note}
                                        onChange={(e) => onChangeNote(item.id, item.retailer.id ?? '', e.target.value)}
                                        allowClear
                                    />
                                </Col>
                                <Col flex='2%'>
                                    <DeleteOutlined id={`delete-icon-${item.id}`} onClick={() => dispatch(deleteItem({id: item.id, retailerId: item.retailer.id ?? ''}))}/>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                ))
            }
        </div>
    );

};

export default OrderItems;