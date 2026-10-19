import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero.jpg";
import interior from "@/assets/interior.jpg";
import dish1 from "@/assets/dish1.jpg";
import dish2 from "@/assets/dish2.jpg";
import { ReservationForm } from "@/components/ReservationForm";
import { FoodMenu, MENU_ITEMS } from "@/components/FoodMenu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bella Restaurant — Good Food, Great Moments" },
      { name: "description", content: "Bella Restaurant: seasonal fine dining, signature dishes, and table reservations." },
      { property: "og:title", content: "Bella Restaurant — Good Food, Great Moments" },
      { property: "og:description", content: "Seasonal fine dining, signature dishes, and easy table reservations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["home", "Home"], ["about", "About Us"], ["menu", "Menu"], ["specials", "Specials"],
  ["reservations", "Reservations"], ["contact", "Contact"], ["admin", "Admin"],
] as const;


type Reservation = { id: number; name: string; phone: string; date: string; time: string; guests: string };

function Heading({ eyebrow, title, light }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className="mb-14 flex flex-col items-center text-center">
      <span className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</span>
      <h2 className={`font-display text-4xl md:text-5xl ${light ? "text-cream" : "text-primary"}`}>{title}</h2>
      <div className="gold-rule mt-5" />
    </div>
  );
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Reservation[]>([]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    setList(JSON.parse(localStorage.getItem("bella-res") || "[]"));
    return () => window.removeEventListener("scroll", on);
  }, []);

  const save = (l: Reservation[]) => { setList(l); localStorage.setItem("bella-res", JSON.stringify(l)); };


  const guests = list.reduce((a, r) => a + Number(r.guests || 0), 0);

  return (
    <div className="font-sans">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-forest/95 py-3 shadow-lg backdrop-blur" : "bg-transparent py-6"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#home" className="font-display text-3xl text-cream">Bella<span className="text-gold">.</span></a>
          <nav className="hidden gap-8 lg:flex">
            {NAV.map(([id, l]) => (
              <a key={id} href={`#${id}`} className="text-sm uppercase tracking-widest text-cream/80 transition hover:text-gold">{l}</a>
            ))}
          </nav>
          <button onClick={() => setOpen(!open)} className="text-cream lg:hidden" aria-label="Menu">
            <div className="space-y-1.5"><span className="block h-px w-6 bg-cream" /><span className="block h-px w-6 bg-cream" /><span className="block h-px w-6 bg-cream" /></div>
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-4 bg-forest px-6 py-6 lg:hidden">
            {NAV.map(([id, l]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-cream/80 hover:text-gold">{l}</a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <img src={hero} alt="Signature plated dish at Bella" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/70" />
        <div className="relative z-10 px-6 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <span className="text-xs uppercase tracking-[0.5em] text-gold">Est. 2008 · Fine Dining</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-cream md:text-7xl lg:text-8xl">Good Food,<br /><em className="text-gold">Great Moments</em></h1>
          <p className="mx-auto mt-6 max-w-xl text-cream/80">Seasonal ingredients, timeless recipes, and an evening you'll remember.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#menu" className="rounded-sm bg-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-forest transition hover:bg-cream">Explore Menu</a>
            <a href="#reservations" className="rounded-sm border border-cream/50 px-8 py-4 text-sm uppercase tracking-widest text-cream transition hover:border-gold hover:text-gold">Book a Table</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-background py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
          <div className="relative">
            <img src={interior} alt="Bella dining room" loading="lazy" width={1024} height={1024} className="rounded-sm shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 hidden border border-gold bg-primary p-6 text-center md:block">
              <div className="font-display text-4xl text-gold">18</div>
              <div className="text-xs uppercase tracking-widest text-cream">Years of passion</div>
            </div>
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.35em] text-gold">Our Story</span>
            <h2 className="mt-3 font-display text-4xl text-primary md:text-5xl">A table where every meal becomes a memory</h2>
            <div className="gold-rule my-6" />
            <p className="leading-relaxed text-muted-foreground">Bella began as a small family kitchen with one belief: great food brings people together. Today, our chefs blend classic European technique with the finest local produce.</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">From candle-lit dinners to joyful celebrations, we craft every plate and every moment with care.</p>
            <div className="mt-8 grid grid-cols-3 gap-6 text-center">
              {[["50+", "Dishes"], ["12", "Chefs"], ["4.9★", "Rating"]].map(([n, l]) => (
                <div key={l}><div className="font-display text-3xl text-primary">{n}</div><div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Heading eyebrow="Taste the Season" title="Our Menu" />
          <FoodMenu />
        </div>
      </section>

      {/* Specials */}
      <section id="specials" className="bg-forest py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Heading eyebrow="Chef's Selection" title="Special Dishes" light />
          <div className="grid gap-8 md:grid-cols-3">
            {[
              [dish1, "Black Truffle Risotto", "Carnaroli rice, shaved Périgord truffle", 34],
              [dish2, "Prime Ribeye", "Dry-aged 28 days, roasted roots", 42],
              [hero, "Filet & Foie Gras", "Pea velouté, red wine reduction", 48],
            ].map(([img, n, d, p]) => (
              <div key={n as string} className="group overflow-hidden rounded-sm border border-gold/20 bg-primary">
                <div className="overflow-hidden"><img src={img as string} alt={n as string} loading="lazy" width={816} height={816} className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110" /></div>
                <div className="p-6">
                  <div className="flex items-center justify-between"><h3 className="font-display text-2xl text-cream">{n}</h3><span className="font-display text-2xl text-gold">${p}</span></div>
                  <p className="mt-2 text-sm text-cream/70">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservations */}
      <section id="reservations" className="relative py-24">
        <img src={interior} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/85" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Heading eyebrow="Reserve Your Evening" title="Book a Table" light />
          <ReservationForm onSaved={(r) => save([{ id: Date.now(), name: r.name, phone: r.phone, date: r.date, time: r.time, guests: String(r.guests) }, ...list])} />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Heading eyebrow="Visit Us" title="Contact" />
          <div className="grid gap-6 md:grid-cols-3">
            {[["Address", "123 Olive Street", "Downtown, City 10001"], ["Opening Hours", "Mon–Fri: 12pm – 11pm", "Sat–Sun: 10am – 12am"], ["Get in Touch", "+1 (555) 123-4567", "hello@bella.com"]].map(([t, a, b]) => (
              <div key={t} className="rounded-sm border border-border bg-card p-8 text-center transition hover:border-gold hover:shadow-xl">
                <h3 className="font-display text-2xl text-primary">{t}</h3>
                <div className="gold-rule mx-auto my-4" />
                <p className="text-muted-foreground">{a}</p><p className="text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin */}
      <section id="admin" className="bg-secondary py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Heading eyebrow="Management" title="Admin Dashboard" />
          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            {[["Reservations", list.length], ["Total Guests", guests], ["Menu Items", MENU_ITEMS.length]].map(([l, v]) => (
              <div key={l} className="rounded-sm bg-primary p-6"><div className="text-xs uppercase tracking-widest text-cream/70">{l}</div><div className="mt-2 font-display text-5xl text-gold">{v}</div></div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-sm border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
                <tr>{["Name", "Phone", "Date", "Time", "Guests", ""].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No reservations yet.</td></tr>}
                {list.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-5 py-4 font-medium text-primary">{r.name}</td><td className="px-5 py-4">{r.phone}</td><td className="px-5 py-4">{r.date}</td><td className="px-5 py-4">{r.time}</td><td className="px-5 py-4">{r.guests}</td>
                    <td className="px-5 py-4 text-right"><button onClick={() => save(list.filter((x) => x.id !== r.id))} className="text-xs uppercase tracking-widest text-destructive hover:underline">Cancel</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="bg-forest py-10 text-center">
        <div className="font-display text-3xl text-cream">Bella<span className="text-gold">.</span></div>
        <p className="mt-2 text-xs uppercase tracking-widest text-cream/60">© 2026 Bella Restaurant · Good Food, Great Moments</p>
      </footer>
    </div>
  );
}
