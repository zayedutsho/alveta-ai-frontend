export type Currency = 'USD' | 'BDT';
export interface PublicPackage {
  id: string; slug: string; name: string; description: string;
  price: { usd: number; bdt: number | null };
  token_value: number | null; model_access: string[];
  features: Record<string, boolean | string>;
  is_team_enabled: boolean;
  per_seat_price: { usd: number | null; bdt: number | null };
  min_team_seats: number;
}
export interface PublicModel { model_id: string; name: string; provider: string; }
export interface PackageCatalog { packages: PublicPackage[]; detected_currency: Currency; }
