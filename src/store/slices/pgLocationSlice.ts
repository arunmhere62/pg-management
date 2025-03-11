'use client';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getInitialPgLocation = () => {
  return {
    pgLocationId: Cookies.get('pgLocationId')
      ? Number(Cookies.get('pgLocationId'))
      : null,
    pgLocationName: Cookies.get('pgLocationName') || ''
  };
};

const initialState = getInitialPgLocation();

const pgLocationSlice = createSlice({
  name: 'pgLocation',
  initialState,
  reducers: {
    setPgLocation: (state, action) => {
      state.pgLocationId = action.payload.id;
      state.pgLocationName = action.payload.name;
      Cookies.set('pgLocationId', action.payload.id.toString(), { expires: 7 }); // 7 days expiry
      Cookies.set('pgLocationName', action.payload.name, { expires: 7 });
    },
    clearPgLocation: (state) => {
      state.pgLocationId = null;
      state.pgLocationName = '';
      Cookies.remove('pgLocationId');
      Cookies.remove('pgLocationName');
    }
  }
});

export const { setPgLocation, clearPgLocation } = pgLocationSlice.actions;
export default pgLocationSlice.reducer;
