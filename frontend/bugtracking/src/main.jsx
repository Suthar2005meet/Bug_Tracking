import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './AuthProvider.jsx' 
import { ToastProvider } from './context/ToastContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <NotificationProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </NotificationProvider>
    </AuthProvider>
)
