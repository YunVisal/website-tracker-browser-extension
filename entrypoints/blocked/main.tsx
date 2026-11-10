import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { theme } from '../popup/theme';
import '@mantine/core/styles.css';
import './App.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MantineProvider theme={theme} forceColorScheme="dark">
            <App />
        </MantineProvider>
    </React.StrictMode>,
);