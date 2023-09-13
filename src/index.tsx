import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Config, Sepolia, Mainnet, DAppProvider } from "@usedapp/core";
import { config } from './config';
import { Provider } from 'react-redux';
import { store } from './store';

const DAppConfig: Config = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Sepolia.chainId]: config.network.sepolia.url,
    [Mainnet.chainId]: config.network.mainnet.url,
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <DAppProvider config={DAppConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </DAppProvider>
);