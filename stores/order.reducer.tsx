import {createSlice} from "@reduxjs/toolkit";
import {OrderRequestDTO} from "../models/order/OrderRequest";

export interface IOrderState {
    orders: OrderRequestDTO;
}

const initialState: IOrderState = {
    orders: {}
}

const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {

    }
});

// export const {} = orderSlide.actions;
export default orderSlide.reducer;