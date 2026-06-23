const url=(import.meta.env.VITE_SUPABASE_URL as string|undefined)?.replace(/\/$/,'');
const anon=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
export const hasSupabase=Boolean(url&&anon);
type Method='GET'|'POST'|'PATCH'|'DELETE';
function token(){try{return JSON.parse(localStorage.getItem('laoban-session')||'null')?.access_token as string|undefined}catch{return undefined}}
async function request<T>(path:string,method:Method='GET',body?:unknown,auth=false):Promise<T>{if(!url||!anon)throw new Error('Supabase is not configured.');const res=await fetch(`${url}${path}`,{method,headers:{apikey:anon,Authorization:`Bearer ${auth&&token()?token():anon}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body?JSON.stringify(body):undefined});if(!res.ok){const e=await res.json().catch(()=>({message:'Request failed'}));throw new Error(e.message||e.error_description||'Request failed');}return res.status===204?({}as T):res.json()}
export async function signIn(email:string,password:string){const session=await request<{access_token:string;user:{id:string;email:string}}>('/auth/v1/token?grant_type=password','POST',{email,password});localStorage.setItem('laoban-session',JSON.stringify(session));return session}
export async function signUp(email:string,password:string,fullName:string){return request('/auth/v1/signup','POST',{email,password,data:{full_name:fullName}})}
export function signOut(){localStorage.removeItem('laoban-session')}
export function currentSession(){try{return JSON.parse(localStorage.getItem('laoban-session')||'null')}catch{return null}}
export async function createOrder(input:{customer:Record<string,string>;items:Array<{product_id:string;size:string;color:string;quantity:number}>;payment_method:string}){if(!hasSupabase)return{order_number:`LB-DEMO-${Date.now().toString().slice(-6)}`};return request<{order_number:string}>('/rest/v1/rpc/create_order','POST',{payload:input})}
export async function subscribe(email:string){if(!hasSupabase){localStorage.setItem('laoban-newsletter',email);return}await request('/rest/v1/newsletter_subscribers','POST',{email})}
export async function adminList(table:'products'|'orders'|'profiles'|'newsletter_subscribers'){return request<Record<string,unknown>[]>(`/rest/v1/${table}?select=*&order=created_at.desc`,'GET',undefined,true)}
