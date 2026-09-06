export type DeviceKind = "ios" | "android" | "other";

export type ReferralCard = {
  id: string;
  slug: string;
  referrer_name: string;
  label: string;
  created_at: string;
  active: boolean;
};

export type CardVisit = {
  id: string;
  card_id: string;
  timestamp: string;
  source: string;
  device: DeviceKind;
  landing_page: string;
};

export type CardLead = {
  id: string;
  name: string;
  business_name: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  message: string;
  referral_card_id: string;
  referral_slug: string;
  created_at: string;
};

export type TapStoreState = {
  cards: ReferralCard[];
  visits: CardVisit[];
  leads: CardLead[];
};

export type CardStats = {
  card: ReferralCard;
  visits: number;
  leads: number;
  conversion_rate: number;
  url: string;
};

export type CreateCardInput = {
  slug: string;
  referrer_name: string;
  label?: string;
};

export type CreateLeadInput = {
  name: string;
  business_name: string;
  phone: string;
  email: string;
  website?: string;
  city?: string;
  message?: string;
  referral_slug: string;
  company?: string;
};
