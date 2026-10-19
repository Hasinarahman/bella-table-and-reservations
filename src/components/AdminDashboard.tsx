import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; name: string; phone: string; reservation_date: string; reservation_time: string; guests: number; special_requests: string | null };

const field = "w-full rounded-sm border border-border bg-background px-4 py-3 text-foreground focus:border-gold focus:outline-none";
const btn = "rounded-sm bg-primary px-5 py-3 text-xs uppercase tracking-widest text-primary-foreground transition hover:bg-gold hover:text-forest disabled:opacity-60";

export function AdminDashboard({ menuCount }: { menuCount: number }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; m: string } | null>(null);
  const [mode, setMode] = useState<"in" | "up">("in");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reservations").select("id,name,phone,reservation_date,reservation_time,guests,special_requests").order("reservation_date").order("reservation_time");
    setLoading(false);
    if (error) setMsg({ t: "err", m: "Could not load reservations." });
    else { setRows(data ?? []); setMsg(null); }
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); setRows([]); return; }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
      if (data) load();
    });
  }, [session, load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) setMsg({ t: "err", m: "Could not delete reservation." });
    else { setRows((r) => r.filter((x) => x.id !== id)); setMsg({ t: "ok", m: "Reservation deleted." }); }
  };

  const auth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim(), password = String(f.get("password"));
    if (!email || password.length < 6) return setMsg({ t: "err", m: "Enter an email and a password of at least 6 characters." });
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/#admin` } });
    if (error) setMsg({ t: "err", m: error.message });
    else if (mode === "up") setMsg({ t: "ok", m: "Check your email to confirm your account, then sign in." });
    else setMsg(null);
  };

  const Note = () => msg && <p role="status" className={`mb-6 rounded-sm border px-4 py-3 text-sm ${msg.t === "ok" ? "border-gold bg-gold/15 text-primary" : "border-destructive bg-destructive/10 text-destructive"}`}>{msg.m}</p>;

  if (!session) return (
    <form onSubmit={auth} className="mx-auto max-w-md rounded-sm border border-border bg-card p-8">
      <h3 className="mb-6 text-center font-display text-3xl text-primary">{mode === "in" ? "Admin Sign In" : "Create Admin Account"}</h3>
      <Note />
      <div className="space-y-4">
        <input name="email" type="email" placeholder="Email" className={field} />
        <input name="password" type="password" placeholder="Password" className={field} />
        <button className={`${btn} w-full`}>{mode === "in" ? "Sign In" : "Create Account"}</button>
      </div>
      <button type="button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="mt-4 w-full text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-gold">
        {mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}
      </button>
    </form>
  );

  if (isAdmin === false) return (
    <div className="mx-auto max-w-md rounded-sm border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">This account doesn't have admin access.</p>
      <button onClick={() => supabase.auth.signOut()} className={`${btn} mt-6`}>Sign Out</button>
    </div>
  );

  const guests = rows.reduce((a, r) => a + r.guests, 0);
  return (
    <div>
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        {[["Reservations", rows.length], ["Total Guests", guests], ["Menu Items", menuCount]].map(([l, v]) => (
          <div key={l} className="rounded-sm bg-primary p-6"><div className="text-xs uppercase tracking-widest text-cream/70">{l}</div><div className="mt-2 font-display text-5xl text-gold">{v}</div></div>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Signed in as {session.user.email}</span>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className={btn}>{loading ? "Refreshing…" : "↻ Refresh"}</button>
          <button onClick={() => supabase.auth.signOut()} className="rounded-sm border border-border px-5 py-3 text-xs uppercase tracking-widest text-primary hover:border-gold">Sign Out</button>
        </div>
      </div>
      <Note />
      <div className="overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-widest text-muted-foreground">
            <tr>{["Name", "Phone", "Date", "Time", "Guests", "Requests", ""].map((h) => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">{loading ? "Loading…" : "No reservations yet."}</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-5 py-4 font-medium text-primary">{r.name}</td>
                <td className="px-5 py-4">{r.phone}</td>
                <td className="px-5 py-4">{r.reservation_date}</td>
                <td className="px-5 py-4">{r.reservation_time.slice(0, 5)}</td>
                <td className="px-5 py-4">{r.guests}</td>
                <td className="max-w-xs truncate px-5 py-4 text-muted-foreground">{r.special_requests || "—"}</td>
                <td className="px-5 py-4 text-right"><button onClick={() => remove(r.id)} className="text-xs uppercase tracking-widest text-destructive hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
