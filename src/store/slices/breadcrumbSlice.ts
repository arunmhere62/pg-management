// store/breadcrumbSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BreadcrumbItem {
  title: string;
  link?: string;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
}

const initialState: BreadcrumbState = {
  items: []
};

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumbs(state, action: PayloadAction<BreadcrumbItem[]>) {
      state.items = action.payload;
    },
    clearBreadcrumbs(state) {
      state.items = [];
    }
  }
});

export const { setBreadcrumbs, clearBreadcrumbs } = breadcrumbSlice.actions;
export default breadcrumbSlice.reducer;
