// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../pages/counter/counterSlice';
// import videoReducer from '../pages/video/videoSlice'

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     videos: videoReducer,
//   },
// });

import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import counterReducer from '../pages/counter/counterSlice';
import videoReducer from '../pages/video/videoSlice';
import authReducer from '../pages/auth/authSlice';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['videos', 'auth'],
};

const videosPersistConfig = {
  key: 'videos',
  storage: storage,
  whitelist: ['video'],
};

const reducers = combineReducers({
  counter: counterReducer,
  auth: authReducer,
  videos: persistReducer(videosPersistConfig, videoReducer),
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export default store;
