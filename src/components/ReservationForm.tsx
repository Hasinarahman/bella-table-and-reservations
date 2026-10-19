import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { reservationSchema, type ReservationInput } from "@/lib/reservation-schema";
import { createReservation } from "@/lib/reservations.functions";

const input = "w-full rounded-md border border-cream/20 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none";

export function ReservationForm({ onSaved }: { onSaved: (r: ReservationInput) => void }) {
  const save = useServerFn(createReservation);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus(null);
    const parsed = reservationSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs);
      setStatus({ type: "error", msg: "Please fix the highlighted fields." });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await save({ data: parsed.data });
      if (res.ok) {
        form.reset();
        onSaved(parsed.data);
        setStatus({ type: "success", msg: `Thank you, ${parsed.data.name}! Your table for ${parsed.data.guests} is reserved.` });
      } else setStatus({ type: "error", msg: res.error });
    } catch {
      setStatus({ type: "error", msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const Err = ({ f }: { f: string }) => (errors[f] ? <p className="mt-1 text-xs text-gold">{errors[f]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-sm border border-gold/30 bg-forest/60 p-8 backdrop-blur md:grid-cols-2">
      <div><input name="name" placeholder="Full name" maxLength={100} className={input} /><Err f="name" /></div>
      <div><input name="phone" type="tel" placeholder="Phone number" maxLength={20} className={input} /><Err f="phone" /></div>
      <div><input name="date" type="date" min={new Date().toISOString().slice(0, 10)} className={input} /><Err f="date" /></div>
      <div><input name="time" type="time" className={input} /><Err f="time" /></div>
      <div className="md:col-span-2">
        <select name="guests" className={input} defaultValue="2">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((g) => <option key={g} value={g} className="bg-forest">{g} {g === 1 ? "guest" : "guests"}</option>)}
        </select>
        <Err f="guests" />
      </div>
      <div className="md:col-span-2">
        <textarea name="requests" rows={3} maxLength={500} placeholder="Special requests (allergies, occasion, seating…)" className={input} />
        <Err f="requests" />
      </div>
      <button disabled={loading} className="rounded-sm bg-gold py-4 text-sm font-medium uppercase tracking-widest text-forest transition hover:bg-cream disabled:opacity-60 md:col-span-2">
        {loading ? "Reserving…" : "Reserve Now"}
      </button>
      {status && (
        <p role="status" className={`rounded-sm border px-4 py-3 text-center text-sm md:col-span-2 ${status.type === "success" ? "border-gold bg-gold/15 text-gold" : "border-destructive bg-destructive/20 text-cream"}`}>
          {status.msg}
        </p>
      )}
    </form>
  );
}
