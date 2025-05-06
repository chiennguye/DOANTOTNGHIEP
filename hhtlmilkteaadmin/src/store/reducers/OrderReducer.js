import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listProcess: [],
    totalPagesProcess: 1,
    listShipping: [],
    totalPagesShipping: 1,
    listSuccess: [],
    totalPagesSuccess: 1,
    listFail: [],
    totalPagesFail: 1,
    revenue: []
};

const OrderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        getListProcess: (state, action) => {
            state.totalPagesProcess = action.payload.totalPages;
            state.listProcess = action.payload.content;
        },
        getListShipping: (state, action) => {
            console.log("Reducer getListShipping received data:", action.payload);
            state.totalPagesShipping = action.payload.totalPages;
            state.listShipping = action.payload.content;
            console.log("Updated state:", state);
        },
        getListSuccess: (state, action) => {
            state.totalPagesSuccess = action.payload.totalPages;
            state.listSuccess = action.payload.content;
        },
        getListFail: (state, action) => {
            state.totalPagesFail = action.payload.totalPages;
            state.listFail = action.payload.content;
        },
        onStatus: (state, action) => {
            const orderId = action.payload.id;
            const newStatus = action.payload.status;
            
            // Tìm đơn hàng trong tất cả các danh sách
            let order = state.listProcess.find(o => o.id === orderId);
            let sourceList = 'listProcess';
            
            if (!order) {
                order = state.listShipping.find(o => o.id === orderId);
                sourceList = 'listShipping';
            }
            
            if (!order) {
                order = state.listSuccess.find(o => o.id === orderId);
                sourceList = 'listSuccess';
            }
            
            if (!order) {
                order = state.listFail.find(o => o.id === orderId);
                sourceList = 'listFail';
            }
            
            if (order) {
                // Cập nhật trạng thái
                order.status = newStatus;
                
                // Xóa đơn hàng khỏi danh sách hiện tại
                switch(sourceList) {
                    case 'listProcess':
                        state.listProcess = state.listProcess.filter(o => o.id !== orderId);
                        break;
                    case 'listShipping':
                        state.listShipping = state.listShipping.filter(o => o.id !== orderId);
                        break;
                    case 'listSuccess':
                        state.listSuccess = state.listSuccess.filter(o => o.id !== orderId);
                        break;
                    case 'listFail':
                        state.listFail = state.listFail.filter(o => o.id !== orderId);
                        break;
                }
                
                // Thêm vào danh sách mới tương ứng với trạng thái
                switch(newStatus) {
                    case 1:
                    case 2:
                        state.listProcess.push(order);
                        break;
                    case 3:
                        state.listSuccess.push(order);
                        break;
                    case 4:
                        state.listFail.push(order);
                        break;
                }
            }
        },
    },
});

const { reducer, actions } = OrderSlice;
export const { getListProcess, getListShipping, getListSuccess, getListFail, onStatus } = actions;
export default reducer;