import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ConfigProvider locale={esES}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
