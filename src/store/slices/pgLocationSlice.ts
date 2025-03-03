'use client';
import { createSlice } from '@reduxjs/toolkit';

const getInitialPgLocation = () => {
  if (typeof window !== 'undefined') {
    return {
      pgLocationId: window.localStorage.getItem('pgLocationId')
        ? Number(window.localStorage.getItem('pgLocationId'))
        : null,
      pgLocationName: window.localStorage.getItem('pgLocationName') || ''
    };
  }
  return {
    pgLocationId: null,
    pgLocationName: ''
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
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'pgLocationId',
          action.payload.id.toString()
        );
        window.localStorage.setItem('pgLocationName', action.payload.name);
      }
    },
    clearPgLocation: (state) => {
      state.pgLocationId = null;
      state.pgLocationName = '';
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('pgLocationId');
        window.localStorage.removeItem('pgLocationName');
      }
    }
  }
});

export const { setPgLocation, clearPgLocation } = pgLocationSlice.actions;
export default pgLocationSlice.reducer;
