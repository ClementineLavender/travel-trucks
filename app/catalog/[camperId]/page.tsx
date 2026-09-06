import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaMap } from "react-icons/fa";
import Header from "@/components/Header/Header";
import Gallery from "@/components/Gallery/Gallery";
import Rating from "@/components/Rating/Rating";
import Reviews from "@/components/Reviews/Reviews";
import BookingForm from "@/components/BookingForm/BookingForm";
import { getCamper, getCamperReviews } from "@/lib/api";
import type { Camper } from "@/types/camper";
import styles from "./details.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ camperId: string }>;
}): Promise<Metadata> {
  try {
    const { camperId } = await params;
    const camper = await getCamper(camperId);
    return { title: camper.name, description: camper.description };
  } catch {
    return { title: "Camper details" };
  }
}

const formatValue = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatPrice = (price: number) =>
  `€${Number(price).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const formatLocation = (location: string) => {
  const [country, city] = location.split(",").map((part) => part.trim());

  if (!country || !city) {
    return location;
  }

  return `${city}, ${country}`;
};
const getEquipment = (camper: Camper) => {
  const amenities = camper.amenities ?? [];

  return [
    {
      key: "transmission",
      value: camper.transmission,
      label: formatValue(String(camper.transmission ?? "")),
    },
    {
      key: "ac",
      value: camper.AC ?? amenities.includes("ac"),
      label: "AC",
    },
    {
      key: "engine",
      value: camper.engine,
      label: formatValue(String(camper.engine ?? "")),
    },
    {
      key: "kitchen",
      value: camper.kitchen ?? amenities.includes("kitchen"),
      label: "Kitchen",
    },
    {
      key: "radio",
      value: camper.radio ?? amenities.includes("radio"),
      label: "Radio",
    },
    {
      key: "form",
      value: camper.form,
      label: formatValue(String(camper.form ?? "")),
    },
  ].filter((item) => Boolean(item.value));
};

const formatUnit = (value: string | number | undefined, unit: string) => {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const stringValue = String(value).trim();

  if (stringValue.endsWith(unit)) {
    return `${stringValue.slice(0, -unit.length).trim()} ${unit}`;
  }

  return `${stringValue} ${unit}`;
};

export default async function CamperDetailsPage({
  params,
}: {
  params: Promise<{ camperId: string }>;
}) {
  const { camperId } = await params;
  let camper: Camper;
  try {
    camper = await getCamper(camperId);
  } catch {
    notFound();
  }

  const gallery = camper.gallery?.length
    ? camper.gallery
    : camper.coverImage
      ? [camper.coverImage]
      : [];
  const reviews = await getCamperReviews(camperId).catch(
    () => camper.reviews ?? [],
  );
  const equipment = getEquipment(camper);

  return (
    <>
      <Header />
      <main className="container">
        <article className={styles.page}>
          <div className={styles.topGrid}>
            <Gallery images={gallery} name={camper.name} />
            <div>
              <section
                className={styles.summaryCard}
                aria-labelledby="camper-name"
              >
                <h1 id="camper-name">{camper.name}</h1>
                <div className={styles.submeta}>
                  <Rating
                    value={camper.rating}
                    count={camper.totalReviews ?? camper.reviews?.length ?? 0}
                  />
                  <span className={styles.location}>
                    <FaMap aria-hidden="true" />
                    {formatLocation(camper.location)}
                  </span>
                </div>
                <div className={styles.price}>{formatPrice(camper.price)}</div>
                <p className={styles.description}>{camper.description}</p>
              </section>
              <section
                className={styles.detailsCard}
                aria-labelledby="vehicle-details-title"
              >
                <h2 id="vehicle-details-title">Vehicle details</h2>
                <div className={styles.featureGrid}>
                  {equipment.map((item) => (
                    <span className={styles.feature} key={item.key}>
                      {item.label}
                    </span>
                  ))}
                </div>
                <dl className={styles.specs}>
                  {[
                    ["Form", camper.form && formatValue(camper.form)],
                    ["Length", formatUnit(camper.length, "m")],
                    ["Width", formatUnit(camper.width, "m")],
                    ["Height", formatUnit(camper.height, "m")],
                    ["Tank", formatUnit(camper.tank, "l")],
                    ["Consumption", formatUnit(camper.consumption, "l/100km")],
                  ]
                    .filter(([, value]) => Boolean(value))
                    .map(([label, value]) => (
                      <div key={String(label)}>
                        <dt>{label}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            </div>
          </div>
          <div className={styles.bottomGrid}>
            <section
              className={styles.reviewsSection}
              aria-labelledby="reviews-title"
            >
              <h2 id="reviews-title">Reviews</h2>
              <Reviews
                reviews={reviews}
                totalReviews={camper.totalReviews ?? reviews.length}
              />
            </section>
            <aside className={styles.bookingWrap}>
              <BookingForm camperId={camper.id} />
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
