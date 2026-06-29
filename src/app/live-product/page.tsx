"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Minus, Plus, RotateCcw, Shield, ShoppingBag, Truck } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { fetchLiveCatalogProductById } from "@/lib/supabaseCatalog";
import { formatPrice } from "@/lib/utils";

export default function LiveProductPage() {
  return (
    <Suspense fallback={<ProductLoading />}>
      <LiveProductContent />
    </Suspense>
  );
}

function ProductLoading() {
  return (
    <div className="min-h-screen bg-warm-white px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-[3/4] shimmer" />
          <div className="space-y-5">
            <div className="h-5 w-32 shimmer" />
            <div className="h-12 w-3/4 shimmer" />
            <div className="h-6 w-44 shimmer" />
            <div className="h-32 w-full shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setStatus("missing");
      return;
    }

    let active = true;
    setStatus("loading");
    fetchLiveCatalogProductById(id)
      .then((item) => {
        if (!active) return;
        if (!item) {
          setStatus("missing");
          return;
        }
        setProduct(item);
        setSelectedImage(0);
        setSelectedSize(item.sizes[0] || "");
        setSelectedColor(item.colors[0]?.name || "");
        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [id]);

  const galleryImages = useMemo(() => {
    const images = product?.galleryImages?.length ? product.galleryImages : product?.images || [];
    return images.filter((image, index, all) => all.indexOf(image) === index);
  }, [product]);

  if (status === "loading") return <ProductLoading />;

  if (status === "missing" || status === "error" || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-white px-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Laoban Product</p>
          <h1 className="mt-3 font-display text-4xl text-charcoal">Product not found</h1>
          <Link href="/shop?section=product" className="mt-6 inline-flex border-b border-charcoal pb-1 text-sm uppercase tracking-[0.16em]">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const selectedImageUrl = galleryImages[selectedImage] || product.images[0];

  const addToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <main className="min-h-screen bg-warm-white">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-warm-gray">
          <Link href="/" className="hover:text-charcoal">Home</Link>
          <span>/</span>
          <Link href="/shop?section=product" className="hover:text-charcoal">Products</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <section className="grid gap-9 lg:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.74fr)] xl:gap-14">
          <div className="grid gap-4 md:grid-cols-[92px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 w-20 shrink-0 overflow-hidden border bg-white md:h-28 md:w-full ${
                    selectedImage === index ? "border-charcoal" : "border-ivory-dark hover:border-charcoal/50"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
              {product.pdfUrl && (
                <a
                  href="#pdf-gallery"
                  className="flex h-24 w-24 shrink-0 items-center justify-center border border-ivory-dark bg-white p-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal hover:border-charcoal md:h-28 md:w-full"
                >
                  PDF Gallery
                </a>
              )}
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory shadow-[0_24px_80px_rgba(34,34,34,0.08)]">
                <Image src={selectedImageUrl} alt={product.name} fill priority className="object-cover" />
                {product.badge && (
                  <span className="absolute left-5 top-5 bg-charcoal px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-warm-gray">
                Click thumbnails to view all product photos
              </p>
            </div>
          </div>

          <aside className="bg-white p-6 shadow-[0_24px_80px_rgba(34,34,34,0.08)] md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{product.category}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-warm-gray">
              Code: {product.productCode}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex items-end gap-3 border-b border-ivory-dark pb-5">
              <span className="text-3xl font-semibold text-charcoal">{formatPrice(product.price)}</span>
              <span className="text-xs uppercase tracking-[0.16em] text-warm-gray">Inclusive of taxes</span>
            </div>

            <p className="mt-6 text-sm leading-7 text-warm-gray">{product.description}</p>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em]">Size</p>
                <span className="text-xs text-warm-gray">Select one</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 min-w-12 border px-4 text-sm transition ${
                      selectedSize === size ? "border-charcoal bg-charcoal text-white" : "border-ivory-dark hover:border-charcoal"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]">
                Color: <span className="text-warm-gray">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-11 w-11 rounded-full border-2 transition ${
                      selectedColor === color.name ? "border-charcoal scale-110" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em]">Quantity</p>
              <div className="flex w-fit items-center border border-ivory-dark">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-11 w-11 items-center justify-center hover:bg-ivory">
                  <Minus size={15} />
                </button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-ivory-dark text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-11 w-11 items-center justify-center hover:bg-ivory">
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={addToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex flex-1 items-center justify-center gap-2 bg-charcoal py-4 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`flex h-[52px] w-[52px] items-center justify-center border transition ${
                  wishlisted ? "border-charcoal bg-charcoal text-white" : "border-ivory-dark hover:border-charcoal"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={19} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {product.pdfUrl && (
              <a
                href="#pdf-gallery"
                className="mt-4 flex w-full items-center justify-center border border-charcoal py-3 text-sm uppercase tracking-[0.16em] text-charcoal transition hover:border-gold hover:text-gold"
              >
                Open PDF Gallery
              </a>
            )}

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ivory-dark pt-6 text-center">
              {[
                { icon: Truck, label: `${product.deliveryDays}-day delivery` },
                { icon: RotateCcw, label: "7-day returns" },
                { icon: Shield, label: "Secure checkout" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="grid place-items-center gap-2 text-xs text-warm-gray">
                  <Icon size={18} className="text-charcoal" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {product.pdfUrl && (
          <section id="pdf-gallery" className="mt-12 scroll-mt-28 bg-white p-5 shadow-[0_24px_80px_rgba(34,34,34,0.08)] md:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gold">PDF Gallery</p>
                <h2 className="font-display text-3xl text-charcoal">Product details and size chart</h2>
              </div>
              <a href={product.pdfUrl} className="border-b border-charcoal pb-1 text-xs uppercase tracking-[0.16em]">
                Open PDF in this window
              </a>
            </div>
            <iframe title={`${product.name} PDF gallery`} src={product.pdfUrl} className="h-[72vh] w-full border border-ivory-dark bg-ivory" />
          </section>
        )}
      </div>
    </main>
  );
}
