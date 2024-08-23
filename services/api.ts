import axios from "axios";

const api = axios.create({
    baseURL: "https://e8c8-167-249-182-138.ngrok-free.app" // Aqui vai a URL da API
})

export default api;