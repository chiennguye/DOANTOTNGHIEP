import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listProcess: [],
    totalPagesProcess: 1,
    listSuccess: [],
    totalPagesSuccess: 1,
    listFail: [],
    totalPagesFail: 1
};

const HistorySlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getListProcess: (state, action) => {
            state.totalPagesProcess = action.payload.totalPages;
            state.listProcess = action.payload.content;
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
            const order = state.listProcess.find((o) => o.id === action.payload.id);
            order.status = action.payload.status;
            state.listProcess = state.listProcess.filter((o) => o.id !== action.payload.id);
            state.listFail.push(order);
        },
    },
});

const { reducer, actions } = HistorySlice;
export const { getListProcess, getListSuccess, getListFail, onStatus } = actions;
export default reducer;