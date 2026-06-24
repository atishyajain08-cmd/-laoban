import { asset } from '../utils/asset';

export interface Product {
  id:string; name:string; slug:string; price:number; originalPrice?:number; description:string;
  category:string; subcategory?:string; colors:string[]; sizes:string[]; images:string[];
  featured:boolean; isNew:boolean; tags:string[]; fabric:string; fit:string; care:string; stock:number;
}

const campaign = {
  black: asset('/assets/campaign/hero-black.png'),
  ivory: asset('/assets/campaign/ivory-tee.png'),
  forest: asset('/assets/campaign/forest-polo.png'),
};

// Sample catalog shown until real products are added through the Admin screen
// (once the Supabase `products` table has rows, those replace these).
export const fallbackProducts: Product[] = [
  {id:'tee-structure',name:'The Structure Tee',slug:'structure-tee',price:1790,description:'A precise everyday tee cut from dense 220 GSM combed cotton. Clean through the shoulder, relaxed through the body, and built to keep its line.',category:'T-Shirts',subcategory:'Crew Neck',colors:['Obsidian','Ivory'],sizes:['S','M','L','XL','XXL'],images:[campaign.black,campaign.ivory],featured:true,isNew:true,tags:['Crew Neck','heavyweight'],fabric:'220 GSM combed cotton',fit:'Relaxed structured fit',care:'Cold wash. Dry in shade.',stock:42},
  {id:'tee-signature',name:'Signature Crew',slug:'signature-crew',price:1490,description:'The foundation piece. Premium compact cotton, a collar that holds, and proportions refined for Indian frames.',category:'T-Shirts',subcategory:'Crew Neck',colors:['Ivory','Obsidian'],sizes:['S','M','L','XL','XXL'],images:[campaign.ivory,campaign.black],featured:true,isNew:false,tags:['Crew Neck','crew'],fabric:'180 GSM compact cotton',fit:'Regular fit',care:'Machine wash cold.',stock:56},
  {id:'polo-knitted',name:'Knitted Authority Polo',slug:'knitted-authority-polo',price:2790,description:'A fine-gauge textured polo with an open collar and a quiet architectural drape. Made for rooms where details matter.',category:'Polos',subcategory:'Knitted',colors:['Forest','Black'],sizes:['S','M','L','XL'],images:[campaign.forest,campaign.black],featured:true,isNew:true,tags:['Knitted','knit'],fabric:'Cotton-viscose knit',fit:'Tailored relaxed fit',care:'Gentle hand wash.',stock:28},
  {id:'tee-oversized',name:'Heavyweight Oversized Tee',slug:'heavyweight-oversized-tee',price:1990,description:'Dropped shoulders, considered volume, and a compact cotton surface. Oversized without losing intention.',category:'T-Shirts',subcategory:'Oversized',colors:['Obsidian','Ivory'],sizes:['S','M','L','XL'],images:[campaign.black,campaign.ivory],featured:true,isNew:false,tags:['Oversized','heavyweight'],fabric:'240 GSM compact cotton',fit:'Oversized box fit',care:'Cold wash inside out.',stock:34},
  {id:'polo-pique',name:'Executive Piqué Polo',slug:'executive-pique-polo',price:2390,description:'Breathable piqué cotton, a reinforced collar, and discreet tonal finishing. A polished answer to Indian summers.',category:'Polos',subcategory:'Classic',colors:['Forest','Ivory'],sizes:['S','M','L','XL','XXL'],images:[campaign.forest,campaign.ivory],featured:false,isNew:false,tags:['Classic','smart-casual'],fabric:'Premium cotton piqué',fit:'Modern regular fit',care:'Machine wash cold.',stock:31},
  {id:'shirt-resort',name:'After Hours Resort Shirt',slug:'after-hours-resort-shirt',price:2990,description:'A fluid open-collar shirt for warm evenings, cut with a clean straight hem and effortless movement.',category:'Shirts',subcategory:'Resort',colors:['Black','Forest'],sizes:['S','M','L','XL'],images:[campaign.forest,campaign.black],featured:false,isNew:true,tags:['Resort','evening'],fabric:'Tencel-cotton twill',fit:'Relaxed fit',care:'Gentle machine wash.',stock:19},
  {id:'tee-long',name:'Long Sleeve Essential',slug:'long-sleeve-essential',price:1990,description:'A transitional essential with a refined neckline, full-length sleeve, and enough weight to wear on its own.',category:'T-Shirts',subcategory:'Henley',colors:['Ivory','Obsidian'],sizes:['S','M','L','XL','XXL'],images:[campaign.ivory,campaign.black],featured:false,isNew:false,tags:['Henley','long-sleeve'],fabric:'200 GSM cotton jersey',fit:'Regular fit',care:'Machine wash cold.',stock:38},
  {id:'trouser-pleat',name:'Single Pleat Trouser',slug:'single-pleat-trouser',price:3490,description:'A clean tapered trouser with a single forward pleat and a comfortable mid rise. Formal enough, never stiff.',category:'Trousers',subcategory:'Trousers',colors:['Charcoal','Black'],sizes:['30','32','34','36','38'],images:[campaign.black,campaign.forest],featured:false,isNew:true,tags:['Trousers','tailoring'],fabric:'Wool-touch stretch twill',fit:'Tapered fit',care:'Dry clean preferred.',stock:24},
];

export const products = fallbackProducts;
export const sizes = ['S','M','L','XL','XXL'] as const;
export const priceRanges = [
  {label:'Under ₹2,000',min:0,max:2000},
  {label:'₹2,000 – ₹3,000',min:2000,max:3000},
  {label:'Above ₹3,000',min:3000,max:Infinity},
] as const;
