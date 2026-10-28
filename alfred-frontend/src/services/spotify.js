const clientId=import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri='http://127.0.0.1:5173/spotify/callback'
const randomString=(size=80)=>Array.from(crypto.getRandomValues(new Uint8Array(size)),x=>'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[x%66]).join('')
const base64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
export const hasSpotifyConfig=Boolean(clientId)
export async function connectSpotify(){
  if(!clientId) throw new Error('Configure VITE_SPOTIFY_CLIENT_ID no arquivo .env e cadastre a URL de redirecionamento.')
  const verifier=randomString(),state=randomString(32)
  const challenge=base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))))
  sessionStorage.setItem('alfred_spotify_verifier',verifier)
  sessionStorage.setItem('alfred_spotify_state',state)
  const url=new URL('https://accounts.spotify.com/authorize')
  url.search=new URLSearchParams({client_id:clientId,response_type:'code',redirect_uri:redirectUri,scope:'user-top-read',state,code_challenge_method:'S256',code_challenge:challenge}).toString()
  location.assign(url.toString())
}
export async function finishSpotify(code,state){
  const verifier=sessionStorage.getItem('alfred_spotify_verifier')
  const expected=sessionStorage.getItem('alfred_spotify_state')
  sessionStorage.removeItem('alfred_spotify_verifier');sessionStorage.removeItem('alfred_spotify_state')
  if(!verifier || !expected || expected!==state) throw new Error('Estado de autorização inválido. Tente conectar novamente.')
  const response=await fetch('https://accounts.spotify.com/api/token',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({client_id:clientId,grant_type:'authorization_code',code,redirect_uri:redirectUri,code_verifier:verifier})
  })
  if(!response.ok) throw new Error('Não foi possível concluir a autorização com Spotify.')
  const tokens=await response.json()
  sessionStorage.setItem('alfred_spotify_token',tokens.access_token)
  return fetchSpotifyTop(tokens.access_token)
}
export async function fetchSpotifyTop(token=sessionStorage.getItem('alfred_spotify_token')){
  if(!token) throw new Error('É necessário conectar a conta Spotify.')
  const get=async type=>{
    const response=await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=20&time_range=medium_term`,{headers:{Authorization:`Bearer ${token}`}})
    if(!response.ok) throw new Error('O Spotify não liberou os dados solicitados para este aplicativo. Verifique o acesso e as permissões.')
    return (await response.json()).items||[]
  }
  const [artists,tracks]=await Promise.all([get('artists'),get('tracks')])
  return {artists,tracks}
}
