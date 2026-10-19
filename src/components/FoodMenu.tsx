import { useMemo, useState } from "react";
import starter from "@/assets/starter.jpg";
import dessert from "@/assets/dessert.jpg";
import drink from "@/assets/drink.jpg";
import fish from "@/assets/fish.jpg";
import risotto from "@/assets/dish1.jpg";
import steak from "@/assets/dish2.jpg";
import filet from "@/assets/hero.jpg";

const CATEGORIES = ["All", "Starters", "Main Courses", "Desserts", "Drinks"] as const;
type Category = (typeof CATEGORIES)[number];

export const MENU_ITEMS: { name: string; desc: string; price: number; cat: Exclude<Category, "All">; img: string; tag?: string }[] = [
  { name: "Burrata & Heirloom Tomato", desc: "Creamy burrata, basil oil, aged balsamic", price: 14, cat: "Starters", img: starter, tag: "Vegetarian" },
  { name: "Tomato Basil Bruschetta", desc: "Grilled sourdough, garlic, olive oil", price: 10, cat: "Starters", img: starter },
  { name: "Truffle Arancini", desc: "Crispy risotto balls, truffle aioli", price: 13, cat: "Starters", img: risotto },
  { name: "Black Truffle Risotto", desc: "Carnaroli rice, shaved truffle, parmigiano", price: 28, cat: "Main Courses", img: risotto, tag: "Chef's pick" },
  { name: "Prime Ribeye Steak", desc: "Dry-aged beef, roasted roots, thyme jus", price: 38, cat: "Main Courses", img: steak },
  { name: "Wild Sea Bass", desc: "Lemon beurre blanc, shaved fennel, dill", price: 32, cat: "Main Courses", img: fish },
  { name: "Filet Mignon", desc: "Pea velouté, red wine reduction", price: 42, cat: "Main Courses", img: filet },
  { name: "Tiramisu Classico", desc: "Mascarpone, espresso, cocoa", price: 11, cat: "Desserts", img: dessert, tag: "Bestseller" },
  { name: "Espresso Affogato", desc: "Vanilla gelato drowned in espresso", price: 9, cat: "Desserts", img: dessert },
  { name: "Golden Hour Cocktail", desc: "Bourbon, honey, lemon twist", price: 15, cat: "Drinks", img: drink, tag: "Signature" },
  { name: "Elderflower Spritz", desc: "Prosecco, elderflower, soda", price: 12, cat: "Drinks", img: drink },
  { name: "Fresh Citrus Lemonade", desc: "Hand-pressed lemons, mint", price: 6, cat: "Drinks", img: drink, tag: "Non-alcoholic" },
];

export function FoodMenu() {
  const [cat, setCat] = useState<Category>("All");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [order, setOrder] = useState<Record<string, number>>({});

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MENU_ITEMS.filter((i) => (cat === "All" || i.cat === cat) && (!s || i.name.toLowerCase().includes(s) || i.desc.toLowerCase().includes(s)));
  }, [cat, q]);

  const count = Object.values(order).reduce((a, b) => a + b, 0);
  const total = MENU_ITEMS.reduce((a, i) => a + (order[i.name] || 0) * i.price, 0);
  const add = (n: string, d: number) => setOrder((o) => ({ ...o, [n]: Math.max(0, (o[n] || 0) + d) }));
  const toggleFav = (n: string) => setFavs((f) => { const x = new Set(f); x.has(n) ? x.delete(n) : x.add(n); return x; });

  return (
    <div>
      <div className="mb-10 flex flex-col items-center gap-6">
        <div className="relative w-full max-w-md">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes…" aria-label="Search menu"
            className="w-full rounded-full border border-border bg-card px-6 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold">✕</button>}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-xs uppercase tracking-widest transition ${cat === c ? "bg-primary text-primary-foreground shadow-md" : "border border-border text-primary hover:border-gold hover:text-gold"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No dishes match "{q}".</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => {
            const qty = order[i.name] || 0;
            const fav = favs.has(i.name);
            return (
              <article key={i.name} className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl animate-in fade-in">
                <div className="relative overflow-hidden">
                  <img src={i.img} alt={i.name} loading="lazy" width={816} height={816} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-110" />
                  {i.tag && <span className="absolute left-3 top-3 rounded-full bg-forest/85 px-3 py-1 text-[10px] uppercase tracking-widest text-gold">{i.tag}</span>}
                  <button onClick={() => toggleFav(i.name)} aria-label="Favorite" aria-pressed={fav}
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-lg transition hover:scale-110 ${fav ? "text-destructive" : "text-primary"}`}>
                    {fav ? "♥" : "♡"}
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold">{i.cat}</span>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl leading-tight text-primary">{i.name}</h3>
                    <span className="font-display text-2xl text-gold">${i.price}</span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{i.desc}</p>
                  <div className="mt-5">
                    {qty === 0 ? (
                      <button onClick={() => add(i.name, 1)} className="w-full rounded-sm bg-primary py-3 text-xs uppercase tracking-widest text-primary-foreground transition hover:bg-gold hover:text-forest">Add to Order</button>
                    ) : (
                      <div className="flex items-center justify-between rounded-sm border border-gold">
                        <button onClick={() => add(i.name, -1)} aria-label="Remove one" className="px-5 py-2 text-lg text-primary hover:text-gold">−</button>
                        <span className="text-sm font-medium text-primary">{qty} in order</span>
                        <button onClick={() => add(i.name, 1)} aria-label="Add one" className="px-5 py-2 text-lg text-primary hover:text-gold">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {count > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-5 rounded-full border border-gold bg-forest px-6 py-3 shadow-2xl animate-in slide-in-from-bottom-4">
          <span className="text-sm text-cream">{count} item{count > 1 ? "s" : ""} · <span className="text-gold">${total}</span></span>
          <a href="#reservations" className="rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-widest text-forest hover:bg-cream">Book & Order</a>
          <button onClick={() => setOrder({})} className="text-xs uppercase tracking-widest text-cream/70 hover:text-cream">Clear</button>
        </div>
      )}
    </div>
  );
}
