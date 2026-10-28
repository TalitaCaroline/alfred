export const CATEGORIES=[
  {slug:'cinema',label:'Cinema',icon:'🎬'},
  {slug:'shows',label:'Shows',icon:'🎤'},
  {slug:'baladas',label:'Baladas',icon:'🪩'},
  {slug:'teatro',label:'Teatro',icon:'🎭'},
  {slug:'danca',label:'Dança',icon:'🩰'},
  {slug:'cultura',label:'Cultura',icon:'🎨'}
]
export const GENRES=[
  {slug:'pop',label:'Pop'}, {slug:'rock',label:'Rock'}, {slug:'indie',label:'Indie'},
  {slug:'eletronica',label:'Eletrônica'}, {slug:'house',label:'House'}, {slug:'techno',label:'Techno'},
  {slug:'funk',label:'Funk'}, {slug:'mpb',label:'MPB'}, {slug:'jazz',label:'Jazz'}, {slug:'brasileira',label:'Música brasileira'}
]
export const CITIES=['Joinville','Florianópolis','Curitiba','São Paulo']
export function dateParts(date){
 const d=new Date(date);const opts={timeZone:'America/Sao_Paulo'}
 return {day:new Intl.DateTimeFormat('pt-BR',{day:'2-digit',...opts}).format(d), month:new Intl.DateTimeFormat('pt-BR',{month:'short',...opts}).format(d).replace('.','').toUpperCase(),
  time:new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',...opts}).format(d),full:new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric',...opts}).format(d)}
}
export const brl=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export const categoryLabel=slug=>CATEGORIES.find(c=>c.slug===slug)?.label||slug
export function distanceKm(aLat,aLng,bLat,bLng){
 const rad=n=>n*Math.PI/180, dLat=rad(bLat-aLat),dLon=rad(bLng-aLng)
 const x=Math.sin(dLat/2)**2+Math.cos(rad(aLat))*Math.cos(rad(bLat))*Math.sin(dLon/2)**2
 return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))
}
