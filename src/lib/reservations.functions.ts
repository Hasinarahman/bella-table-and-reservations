import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { reservationSchema } from "./reservation-schema";

export const createReservation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reservationSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { error } = await supabase.from("reservations").insert({
      name: data.name,
      phone: data.phone,
      reservation_date: data.date,
      reservation_time: data.time,
      guests: data.guests,
      special_requests: data.requests || null,
    });
    if (error) {
      console.error("Reservation insert failed", error);
      return { ok: false as const, error: "We couldn't save your reservation. Please try again." };
    }
    return { ok: true as const };
  });
