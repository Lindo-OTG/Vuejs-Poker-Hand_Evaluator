import { createApp } from 'vue'
import App from './App.vue'

// Create and mount the app
const app = createApp(App)

// Global configuration if needed
app.config.globalProperties.$apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

app.mount('#app')