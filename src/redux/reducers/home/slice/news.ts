import { createSlice } from '@reduxjs/toolkit';
import { getNews } from '../thunk/news';

interface dataType {
    news: any;
    newsError: boolean;
    newsLoading: boolean;
}

const initialState: dataType = {
    news: {},
    newsError: false,
    newsLoading: false,
};

const newsSlice = createSlice({
    name: 'newsSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        (builder.addCase(getNews.pending, (state, action) => {
            state.newsLoading = true;
            state.newsError = false;
        }),
            builder.addCase(getNews.fulfilled, (state, action) => {
                state.newsLoading = false;
                state.news = action?.payload?.result?.data;
            }),
            builder.addCase(getNews.rejected, (state, action) => {
                state.newsLoading = false;
                state.newsError = true;
            }));
    },
});
export default newsSlice.reducer;
