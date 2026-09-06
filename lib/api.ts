import axios from "axios";
import type {
  BookingPayload,
  Camper,
  CamperFilters,
  Review,
} from "@/types/camper";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://campers-api.goit.study";
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
const normalizeUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const markdown = value.match(/^\[.*?\]\((https?:\/\/[^)]+)\)$/);
  return markdown?.[1] ?? value;
};
const stringArray = (value: unknown): string[] => {
  if (typeof value === "string") {
    const url = normalizeUrl(value);
    return url ? [url] : [];
  }
  if (!Array.isArray(value)) {
    const record = asRecord(value);
    const url =
      record.url ??
      record.src ??
      record.image ??
      record.imageUrl ??
      record.original ??
      record.originalUrl ??
      record.href;
    const normalized = normalizeUrl(url);
    return normalized ? [normalized] : [];
  }
  return value.flatMap((item) => {
    if (typeof item === "string") {
      const url = normalizeUrl(item);
      return url ? [url] : [];
    }
    const record = asRecord(item);
    const url =
      record.url ??
      record.src ??
      record.image ??
      record.imageUrl ??
      record.original ??
      record.originalUrl ??
      record.href;
    const normalized = normalizeUrl(url);
    return normalized ? [normalized] : [];
  });
};
const normalizeReview = (value: unknown): Review | null => {
  const record = asRecord(value);
  const name = record.reviewer_name ?? record.reviewerName ?? record.name;
  const rawRating =
    record.reviewer_rating ?? record.reviewerRating ?? record.rating;
  const comment = record.comment ?? record.text ?? record.review;
  const rating =
    typeof rawRating === "number"
      ? rawRating
      : typeof rawRating === "string"
        ? Number(rawRating)
        : NaN;
  if (
    typeof name !== "string" ||
    !Number.isFinite(rating) ||
    typeof comment !== "string"
  )
    return null;
  return {
    reviewer_name: name,
    reviewer_rating: rating,
    comment,
    createdAt:
      typeof record.createdAt === "string" ? record.createdAt : undefined,
  };
};
const normalizeCamper = (value: unknown): Camper => {
  const camper = asRecord(value);
  if (!camper.id || typeof camper.name !== "string")
    throw new Error("Invalid camper response");
  const amenities = Array.isArray(camper.amenities)
    ? camper.amenities.filter(
        (item): item is string => typeof item === "string",
      )
    : [];
  const details = asRecord(camper.details);
  const galleryRaw = stringArray(camper.gallery);
  const imageRaw = stringArray(camper.images);
  const photosRaw = stringArray(camper.photos);
  const galleryDetails = stringArray(
    details.gallery ?? details.images ?? details.photos,
  );
  const gallery = galleryRaw.length
    ? galleryRaw
    : imageRaw.length
      ? imageRaw
      : photosRaw.length
        ? photosRaw
        : galleryDetails.length
          ? galleryDetails
          : typeof camper.coverImage === "string"
            ? [camper.coverImage]
            : typeof camper.image === "string"
              ? [camper.image]
              : [];
  const reviewsValue = camper.reviews ?? details.reviews;
  const reviews = Array.isArray(reviewsValue)
    ? reviewsValue
        .map(normalizeReview)
        .filter((review): review is Review => Boolean(review))
    : [];
  return {
    ...(camper as Camper),
    gallery,
    reviews,
    coverImage:
      typeof camper.coverImage === "string" ? camper.coverImage : gallery[0],
    amenities,
    totalReviews:
      typeof camper.totalReviews === "number"
        ? camper.totalReviews
        : reviews.length,
    AC: typeof camper.AC === "boolean" ? camper.AC : amenities.includes("ac"),
    bathroom:
      typeof camper.bathroom === "boolean"
        ? camper.bathroom
        : amenities.includes("bathroom"),
    kitchen:
      typeof camper.kitchen === "boolean"
        ? camper.kitchen
        : amenities.includes("kitchen"),
    TV: typeof camper.TV === "boolean" ? camper.TV : amenities.includes("tv"),
    radio:
      typeof camper.radio === "boolean"
        ? camper.radio
        : amenities.includes("radio"),
    refrigerator:
      typeof camper.refrigerator === "boolean"
        ? camper.refrigerator
        : amenities.includes("refrigerator"),
    microwave:
      typeof camper.microwave === "boolean"
        ? camper.microwave
        : amenities.includes("microwave"),
    gas:
      typeof camper.gas === "boolean" ? camper.gas : amenities.includes("gas"),
    water:
      typeof camper.water === "boolean"
        ? camper.water
        : amenities.includes("water"),
  };
};
export async function getCampers(
  page: number,
  limit: number,
  filters: CamperFilters,
) {
  const params: Record<string, string | number> = { page, limit };
  if (filters.location) params.location = filters.location;
  if (filters.form) params.form = filters.form;
  if (filters.engine) params.engine = filters.engine;
  if (filters.transmission) params.transmission = filters.transmission;
  const { data } = await api.get<unknown>("/campers", { params });
  if (Array.isArray(data)) return { campers: data.map(normalizeCamper) };
  const payload = asRecord(data);
  const campersValue = Array.isArray(payload.campers)
    ? payload.campers
    : Array.isArray(payload.data)
      ? payload.data
      : [];
  return {
    campers: campersValue.map(normalizeCamper),
    total: typeof payload.total === "number" ? payload.total : undefined,
    perPage: typeof payload.perPage === "number" ? payload.perPage : undefined,
    totalPages:
      typeof payload.totalPages === "number" ? payload.totalPages : undefined,
  };
}
export async function getCamper(id: string) {
  const { data } = await api.get<unknown>(`/campers/${encodeURIComponent(id)}`);
  return normalizeCamper(data);
}

export async function getCamperReviews(id: string): Promise<Review[]> {
  const { data } = await api.get<unknown>(
    `/campers/${encodeURIComponent(id)}/reviews`,
  );

  const record = asRecord(data);

  const values: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(record.reviews)
      ? record.reviews
      : [];

  return values
    .map(normalizeReview)
    .filter((review): review is Review => Boolean(review));
}

export async function createBooking(camperId: string, payload: BookingPayload) {
  const { data } = await api.post(
    `/campers/${encodeURIComponent(camperId)}/booking-requests`,
    payload,
  );
  return data;
}
