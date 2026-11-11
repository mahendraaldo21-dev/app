import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatRupiah, resolveImageUrl } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Search, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState("");
  const [query, setQuery] = useState("");
  const [variantPicker, setVariantPicker] = useState(null); // { product, action: 'cart'|'buy' }
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data || [])).catch(() => {});
    api.get("/categories").then((r) => setCategories(r.data || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, activeCat, query]);

  const hasVariants = (p) => Array.isArray(p.variants) && p.variants.length > 0;

  const doAdd = (p, variant = null) => {
    addItem(p, 1, variant);
    toast.success(
      `${p.name}${variant ? ` (${variant.name})` : ""} ditambahkan ke keranjang`
    );
  };

  const handleAdd = (p) => {
    if (hasVariants(p)) {
      setVariantPicker({ product: p, action: "cart" });
    } else {
      doAdd(p);
    }
  };

  const handleBuyNow = (p) => {
    if (hasVariants(p)) {
      setVariantPicker({ product: p, action: "buy" });
    } else {
      addItem(p, 1);
      navigate("/cart");
    }
  };

  const onVariantConfirm = (variant) => {
    const { product, action } = variantPicker;
    doAdd(product, variant);
    setVariantPicker(null);
    if (action === "buy") navigate("/cart");
  };

  return (
    <div data-testid="shop-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#4A5568]">Katalog</div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
            Pilih barang kesukaanmu
          </h1>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A5568]" />
          <Input
            data-testid="search-input"
            placeholder="Cari barang…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 rounded-full bg-white border-[#E2E8F0] h-11"
          />
        </div>
      </div>

      {/* Filters */}
      <div data-testid="category-filter" className="mt-6 flex flex-wrap gap-2">
        <button
          data-testid="filter-all"
          onClick={() => setActiveCat("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !activeCat
              ? "bg-[#1A202C] text-white border-[#1A202C]"
              : "bg-white text-[#1A202C] border-[#E2E8F0] hover:border-[#1A202C]"
          }`}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            data-testid={`filter-${c.name}`}
            onClick={() => setActiveCat(c.name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCat === c.name
                ? "bg-[#1A202C] text-white border-[#1A202C]"
                : "bg-white text-[#1A202C] border-[#E2E8F0] hover:border-[#1A202C]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          data-testid="empty-state"
          className="mt-16 rounded-3xl border border-dashed border-[#E2E8F0] py-20 text-center text-[#4A5568]"
        >
          <p className="font-medium">Belum ada barang yang cocok.</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => handleAdd(p)}
              onBuy={() => handleBuyNow(p)}
            />
          ))}
        </div>
      )}

      {/* Variant picker dialog */}
      <VariantPickerDialog
        state={variantPicker}
        onClose={() => setVariantPicker(null)}
        onConfirm={onVariantConfirm}
      />
    </div>
  );
}

function ProductCard({ product, onAdd, onBuy }) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const prices = variants.map((v) => v.price);
  const minPrice = hasVariants ? Math.min(...prices) : product.price;
  const maxPrice = hasVariants ? Math.max(...prices) : product.price;
  const showRange = hasVariants && minPrice !== maxPrice;

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-[#E2E8F0] soft-shadow hover-shadow transition-shadow overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-[#F3F1EC] overflow-hidden">
        {product.image_url ? (
          <img
            src={resolveImageUrl(product.image_url)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#4A5568]/40 text-xs">
            Tanpa Gambar
          </div>
        )}
        {hasVariants && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-[#1A202C] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            {variants.length} {product.variant_label || "varian"}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-widest text-[#4A5568]">
          {product.category || "Lain-lain"}
        </div>
        <h3 className="mt-1 font-heading text-base font-semibold leading-snug line-clamp-2 text-[#1A202C]">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-[#4A5568]">
          {product.description}
        </p>
        <div className="mt-3 font-heading text-lg font-bold text-[#1A202C]">
          {showRange ? (
            <>
              {formatRupiah(minPrice)}{" "}
              <span className="text-sm font-medium text-[#4A5568]">– {formatRupiah(maxPrice)}</span>
            </>
          ) : (
            formatRupiah(minPrice)
          )}
        </div>
        <div className="mt-auto pt-3 flex flex-col sm:flex-row gap-2">
          <Button
            data-testid={`add-cart-btn-${product.id}`}
            onClick={onAdd}
            variant="outline"
            size="sm"
            className="rounded-full w-full sm:flex-1 border-[#E2E8F0] hover:border-[#1A202C]"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Keranjang
          </Button>
          <Button
            data-testid={`buy-now-btn-${product.id}`}
            onClick={onBuy}
            size="sm"
            className="rounded-full w-full sm:flex-1 bg-brand hover:bg-[#172554] text-white"
          >
            <Zap className="h-3.5 w-3.5 mr-1" /> Beli
          </Button>
        </div>
      </div>
    </div>
  );
}

function VariantPickerDialog({ state, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [state]);

  if (!state) return null;
  const { product, action } = state;
  const variants = product.variants || [];
  const label = product.variant_label || "Varian";

  const confirm = () => {
    if (!selected) {
      toast.error(`Pilih ${label.toLowerCase()} dulu`);
      return;
    }
    if ((selected.stock ?? 0) <= 0) {
      toast.error(`${label} ${selected.name} sedang habis`);
      return;
    }
    onConfirm(selected);
  };

  return (
    <Dialog open={!!state} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-testid="variant-picker-dialog" className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            Pilih {label.toLowerCase()} sebelum {action === "buy" ? "membeli" : "menambahkan ke keranjang"}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <div className="text-xs uppercase tracking-widest text-[#4A5568] mb-3">{label}</div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => {
              const active = selected?.name === v.name;
              const out = (v.stock ?? 0) <= 0;
              return (
                <button
                  key={i}
                  data-testid={`variant-option-${v.name}`}
                  disabled={out}
                  onClick={() => setSelected(v)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    out
                      ? "bg-[#F3F1EC] text-[#4A5568]/50 border-[#E2E8F0] line-through cursor-not-allowed"
                      : active
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-[#1A202C] border-[#E2E8F0] hover:border-[#1A202C]"
                  }`}
                >
                  {v.name}
                  {out && <span className="ml-1 text-[10px]">(habis)</span>}
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="mt-4 rounded-2xl border border-[#E2E8F0] bg-[#FAF9F6] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#4A5568]">{label}: <strong className="text-[#1A202C]">{selected.name}</strong></span>
              <span className="font-heading font-bold text-lg">{formatRupiah(selected.price)}</span>
            </div>
            <div className="mt-1 text-xs text-[#4A5568]">Stok: {selected.stock ?? 0}</div>
          </div>
        )}

        <div className="mt-4">
          <Button
            data-testid="variant-confirm-btn"
            onClick={confirm}
            className="w-full h-11 rounded-full bg-brand hover:bg-[#C9302C] text-white"
          >
            {action === "buy" ? "Beli Sekarang" : "Tambah ke Keranjang"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
