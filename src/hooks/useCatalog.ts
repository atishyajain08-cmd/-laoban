import{useEffect,useState}from'react';import{fallbackProducts,type Product}from'../data/products';import{hasSupabase}from'../lib/supabase';
type Row=Record<string,unknown>&{product_images?:Array<Record<string,unknown>>;product_variants?:Array<Record<string,unknown>>};
export function useCatalog(){
 const[products,setProducts]=useState<Product[]>(fallbackProducts);const[loading,setLoading]=useState(hasSupabase);
 useEffect(()=>{if(!hasSupabase)return;const base=(import.meta.env.VITE_SUPABASE_URL as string).replace(/\/$/,'');const key=import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  fetch(`${base}/rest/v1/products?select=*,product_images(*),product_variants(*)&is_active=eq.true&order=created_at.desc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}})
   .then(r=>{if(!r.ok)throw new Error('Catalog unavailable');return r.json()})
   .then((rows:Row[])=>{const catalog=rows.map(row=>{const variants=row.product_variants||[];return{id:String(row.id),name:String(row.name),slug:String(row.slug),price:Number(row.price),originalPrice:row.original_price?Number(row.original_price):undefined,description:String(row.description||''),category:String(row.category),colors:[...new Set(variants.map(v=>String(v.color)))],sizes:[...new Set(variants.map(v=>String(v.size)))],images:(row.product_images||[]).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order)).map(i=>String(i.url)),featured:Boolean(row.featured),isNew:Boolean(row.is_new),tags:Array.isArray(row.tags)?row.tags.map(String):[],fabric:String(row.fabric||''),fit:String(row.fit||''),care:String(row.care||''),stock:variants.reduce((s,v)=>s+Number(v.stock||0),0)}as Product}).filter(p=>p.images.length);if(catalog.length)setProducts(catalog)})
   .catch(()=>setProducts(fallbackProducts)).finally(()=>setLoading(false))
 },[]);return{products,loading}
}
