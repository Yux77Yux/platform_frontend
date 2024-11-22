"use client";

import { Provider } from 'react-redux';
import { store } from '@/src/store/store';  // 导入 Redux store

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
      {children}
  </Provider>
);

export default AppProvider;
