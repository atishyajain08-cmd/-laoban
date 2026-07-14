"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Heart, Minus, Plus, RotateCcw, Ruler, Shield, ShoppingBag, Truck, ZoomIn } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { fetchLiveCatalogProductById } from "@/lib/supabaseCatalog";
import RelatedProducts from "@/components/product/RelatedProducts";
import { formatPrice } from "@/lib/utils";
import { trackAddToCart, trackAddToWishlist, trackViewItem } from "@/lib/analytics";

type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (source: { url: string }) => {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getViewport: (options: { scale: number }) => { width: number; height: number };
        render: (options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    }>;
  };
};

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib;
    __laobanPdfJsPromise?: Promise<PdfJsLib>;
  }
}

const PDF_JS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function uniqueImages(images: string[]) {
  return images.filter((image, index, all) => Boolean(image) && all.indexOf(image) === index);
}

function loadPdfJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("PDF rendering requires a browser"));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (window.__laobanPdfJsPromise) return window.__laobanPdfJsPromise;

  window.__laobanPdfJsPromise = new Promise<PdfJsLib>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PDF_JS_SRC;
    script.async = true;
    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF renderer did not load"));
        return;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("Unable to load PDF renderer"));
    document.head.appendChild(script);
  });

  return window.__laobanPdfJsPromise;
}

function ProductImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (src.startsWith("data:")) {
    return <img src={src} alt={alt} className={className} />;
  }

  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
}

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
  const [pdfPageImages, setPdfPageImages] = useState<string[]>([]);
  const [pdfStatus, setPdfStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [zoomOpen, setZoomOpen] = useState(false);

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

  useEffect(() => {
    if (!product?.pdfUrl) {
      setPdfPageImages([]);
      setPdfStatus("idle");
      return;
    }

    let active = true;
    setPdfPageImages([]);
    setPdfStatus("loading");

    loadPdfJs()
      .then(async (pdfjsLib) => {
        const pdf = await pdfjsLib.getDocument({ url: product.pdfUrl! }).promise;
        const pageCount = Math.min(pdf.numPages, 10);
        let renderedCount = 0;

        for (let pageNumber = 1; pageNumber <= pageCount && active; pageNumber += 1) {
          try {
            const page = await pdf.getPage(pageNumber);
            // Cap the render width: large scanned PDFs at full scale exceed
            // mobile canvas limits and the render silently fails.
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = Math.min(1.65, 1600 / baseViewport.width);
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const canvasContext = canvas.getContext("2d");

            if (!canvasContext) continue;

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            await page.render({ canvasContext, viewport }).promise;
            const pageImage = canvas.toDataURL("image/jpeg", 0.9);

            if (!active) return;
            renderedCount += 1;
            // Show each page as soon as it's ready — big PDFs would otherwise
            // leave the customer staring at nothing until all pages finish.
            setPdfPageImages((current) => [...current, pageImage]);
            setPdfStatus("ready");
          } catch {
            // A single failed page shouldn't hide the rest of the gallery.
          }
        }

        if (!active) return;
        if (!renderedCount) setPdfStatus("error");
      })
      .catch(() => {
        if (active) setPdfStatus("error");
      });

    return () => {
      active = false;
    };
  }, [product?.pdfUrl]);

  useEffect(() => {
    if (product) trackViewItem(product);
  }, [product]);

  const productImages = useMemo(() => {
    const images = product?.galleryImages?.length ? product.galleryImages : product?.images || [];
    return uniqueImages(images);
  }, [product]);

  const galleryImages = useMemo(() => uniqueImages([...productImages, ...pdfPageImages]), [productImages, pdfPageImages]);

  useEffect(() => {
    if (selectedImage >= galleryImages.length) setSelectedImage(0);
  }, [galleryImages.length, selectedImage]);

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
    trackAddToCart(product, quantity, selectedSize, selectedColor);
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
          <div className="grid gap-4 md:grid-cols-[104px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto md:sticky md:top-28 md:order-1 md:max-h-[calc(100vh-8rem)] md:flex-col md:overflow-y-auto md:pr-1">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm md:h-28 md:w-full ${
                    selectedImage === index ? "border-charcoal ring-1 ring-charcoal" : "border-ivory-dark hover:border-charcoal/50"
                  }`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <ProductImage src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.pdfUrl && pdfStatus === "loading" && (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-ivory-dark bg-white p-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-warm-gray md:h-28 md:w-full">
                  Loading PDF photos
                </div>
              )}
            </div>

            <div className="order-1 md:order-2">
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="group relative aspect-[4/5] w-full overflow-hidden bg-ivory text-left shadow-[0_24px_80px_rgba(34,34,34,0.08)]"
                aria-label="Open product image zoom"
              >
                <ProductImage src={selectedImageUrl} alt={product.name} priority className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.badge && (
                  <span className="absolute left-5 top-5 bg-charcoal px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-5 right-5 flex items-center gap-2 bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.14em] text-charcoal shadow-lg">
                  <ZoomIn size={14} /> Zoom
                </span>
              </button>
              <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-warm-gray">
                Thumbnail, extra photos, and PDF pages stay in one product gallery
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
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              {[
                ["Fit", product.subcategory || "Regular"],
                ["Fabric", product.category.includes("t-shirt") ? "Cotton rich" : "Premium fabric"],
                ["Dispatch", `${product.deliveryDays} days`],
                ["Origin", "Made for India"],
              ].map(([label, value]) => (
                <div key={label} className="border border-ivory-dark bg-ivory/50 p-3">
                  <p className="uppercase tracking-[0.16em] text-warm-gray">{label}</p>
                  <p className="mt-1 font-medium text-charcoal">{value}</p>
                </div>
              ))}
            </div>

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

            <div className="mt-7 border border-ivory-dark bg-ivory/40 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">
                <Ruler size={16} />
                Size guide
              </div>
              <div className="grid grid-cols-5 border border-ivory-dark bg-white text-center text-[11px]">
                {["Size", "S", "M", "L", "XL"].map((item) => (
                  <span key={item} className="border-r border-ivory-dark px-2 py-2 last:border-r-0">{item}</span>
                ))}
                {["Chest", "38", "40", "42", "44"].map((item) => (
                  <span key={item} className="border-r border-t border-ivory-dark px-2 py-2 last:border-r-0">{item}</span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-5 text-warm-gray">Measurements are in inches. If you are between sizes, choose the larger size for relaxed comfort.</p>
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
                onClick={() => {
                  if (!wishlisted) trackAddToWishlist(product);
                  wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
                }}
                className={`flex h-[52px] w-[52px] items-center justify-center border transition ${
                  wishlisted ? "border-charcoal bg-charcoal text-white" : "border-ivory-dark hover:border-charcoal"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={19} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

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

      </div>

      <RelatedProducts
        name={product.name}
        description={product.description}
        excludeId={product.liveCatalogId || product.id}
      />
      {zoomOpen && (
        <div className="fixed inset-0 z-[80] bg-charcoal/95 p-4 md:p-8" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-5 top-5 z-10 border border-white/20 bg-white px-4 py-2 text-xs uppercase tracking-[0.16em] text-charcoal"
          >
            Close
          </button>
          <div className="flex h-full items-center justify-center">
            <div className="relative h-full max-h-[88vh] w-full max-w-5xl bg-white/5">
              <ProductImage src={selectedImageUrl} alt={product.name} priority className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
