import {Link} from 'react-router-dom';
import type {Product} from '../../data/products';
import {formatPrice} from '../../utils/format';
import {useWishlistStore} from '../../store/useWishlistStore';

export default function ProductCard({product}:{product:Product}){
  const {toggleItem,isInWishlist}=useWishlistStore(); const wished=isInWishlist(product.id);
  return <article className="product-card">
    <Link to={`/product/${product.slug}`} className="product-media">
      <img src={product.images[0]} alt={product.name}/>{product.isNew&&<span className="product-badge">New</span>}
    </Link>
    <button className="wish" aria-label={wished?'Remove from wishlist':'Add to wishlist'} onClick={()=>toggleItem(product.id)}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill={wished?'currentColor':'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
    </button>
    <Link to={`/product/${product.slug}`} className="product-info">
      <div className="product-row"><h3 className="product-name">{product.name}</h3><span className="price">{formatPrice(product.price)}</span></div>
      <p className="product-meta">{product.category} · {product.colors.join(' / ')}</p>
    </Link>
  </article>
}
