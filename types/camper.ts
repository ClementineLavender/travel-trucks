export type Camper = {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  description: string;
  form: string;
  length?: string;
  width?: string;
  height?: string;
  tank?: string;
  consumption?: string;
  transmission?: string;
  engine?: string;
  adults?: number;
  children?: number;
  gallery?: string[];
  coverImage?: string;
  amenities?: string[];
  totalReviews?: number;
  reviews?: Review[];
  details?: Record<string, unknown>;
  AC?: boolean;
  bathroom?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  radio?: boolean;
  refrigerator?: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;
  [key: string]: unknown;
};
export type Review = {
  reviewer_name: string;
  reviewer_rating: number;
  comment: string;
  createdAt?: string;
};
export type CamperFilters = {
  location: string;
  form: string;
  engine: string;
  transmission: string;
};
export type CampersResponse = {
  campers: Camper[];
  total?: number;
  perPage?: number;
  totalPages?: number;
};
export type BookingPayload = {
  name: string;
  email: string;
  date?: string;
  comment?: string;
};
