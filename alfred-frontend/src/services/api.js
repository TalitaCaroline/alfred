import axios from 'axios'

// Cliente HTTP reaproveitado da estrutura FitTrack, adaptado às respostas do Alfred.
const api=axios.create({baseURL:import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api',timeout:8000})
api.interceptors.request.use(config=>{
  const token=localStorage.getItem('token')
  if(token)config.headers.Authorization=`Bearer ${token}`
  return config
})
api.interceptors.response.use(response=>response.data,error=>{
  const payload=error.response?.data || {}
  if(error.response?.status===401 && !error.config?.url?.endsWith('/login')){
    localStorage.removeItem('token');localStorage.removeItem('user')
  }
  return Promise.reject({
    message:payload.message || (error.response?'Falha ao consultar a API.':'A API Alfred está indisponível. Verifique se o backend está ativo.'),
    status:error.response?.status || null,errors:payload.errors || []
  })
})
export default api
