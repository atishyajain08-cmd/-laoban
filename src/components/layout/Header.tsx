import {Link,NavLink} from 'react-router-dom';import {useState} from 'react';import {useCartStore} from '../../store/useCartStore';import {useWishlistStore} from '../../store/useWishlistStore';
const links=[['New arrivals','/shop?filter=new'],['Shop','/shop'],['Journal','/lookbook'],['Our story','/about']];
export default function Header(){const [open,setOpen]=useState(false);const count=useCartStore(s=>s.totalItems());const wishes=useWishlistStore(s=>s.items.length);return <header className="site-header"><div className="shell header-inner">
  <nav className="nav desktop-nav">{links.slice(0,2).map(([l,to])=><NavLink key={to} to={to}>{l}</NavLink>)}</nav>
  <Link className="brand" to="/">LAOBAN</Link>
  <div className="header-actions"><nav className="nav desktop-nav">{links.slice(2).map(([l,to])=><NavLink key={to} to={to}>{l}</NavLink>)}</nav>
    <Link className="icon-link hide-mobile" to="/wishlist" aria-label="Wishlist"><Heart/>{wishes>0&&<span className="badge">{wishes}</span>}</Link>
    <Link className="icon-link" to="/cart" aria-label="Shopping bag"><Bag/>{count>0&&<span className="badge">{count}</span>}</Link>
    <Link className="icon-link hide-mobile" to="/account" aria-label="Account"><User/></Link>
    <button className="menu-button" aria-label="Menu" onClick={()=>setOpen(!open)}><span>{open?'×':'☰'}</span></button>
  </div></div>{open&&<nav className="mobile-nav" style={{position:'fixed',inset:'var(--header-height) 0 0',background:'var(--ink)',padding:'50px 24px',display:'flex',flexDirection:'column',gap:28}}>{links.map(([l,to])=><Link className="title" key={to} to={to} onClick={()=>setOpen(false)}>{l}</Link>)}<Link to="/account" onClick={()=>setOpen(false)}>Account</Link></nav>}</header>}
function Bag(){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>};function Heart(){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>};function User(){return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>}
