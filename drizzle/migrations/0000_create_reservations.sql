CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (phone ~ '^[+0-9 ()-]{7,20}$'),
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  guests integer NOT NULL CHECK (guests BETWEEN 1 AND 20),
  special_requests text CHECK (special_requests IS NULL OR char_length(special_requests) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a reservation" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.validate_reservation_date()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reservation_date < current_date THEN
    RAISE EXCEPTION 'Reservation date cannot be in the past';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER reservations_validate_date BEFORE INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.validate_reservation_date();