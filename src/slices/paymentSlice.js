import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  amount: 1,
  credits: 100,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setAmount: (state, action) => {
      state.amount = action.payload;
      state.credits = action.payload * 100;
    },
  },
});

export const { setAmount } = paymentSlice.actions;
export default paymentSlice.reducer;