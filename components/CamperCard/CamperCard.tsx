import Image from "next/image";
import Link from "next/link";
import { FaGasPump, FaMap, FaCogs, FaCarSide } from "react-icons/fa";
import type { Camper } from "@/types/camper";
import Rating from "@/components/Rating/Rating";
import styles from "./CamperCard.module.css";

const formatForm = (form: string) =>
  form.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const formatPrice = (price: number) =>
  `€${Number(price).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function CamperCard({ camper }: { camper: Camper }) {
  const image = camper.coverImage ?? camper.gallery?.[0];
  const reviewCount = camper.totalReviews ?? camper.reviews?.length ?? 0;
  const features = [
    camper.engine && { icon: <FaGasPump />, label: camper.engine },
    camper.transmission && { icon: <FaCogs />, label: camper.transmission },
    camper.form && { icon: <FaCarSide />, label: formatForm(camper.form) },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image}
            alt={camper.name}
            fill
            sizes="180px"
            className={styles.image}
          />
        ) : (
          <div className={styles.imageFallback}>No image</div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.heading}>
          <h2>{camper.name}</h2>
          <div className={styles.price}>{formatPrice(camper.price)}</div>
        </div>
        <div className={styles.meta}>
          <Rating value={camper.rating} count={reviewCount} />
          <span className={styles.location}>
            <FaMap aria-hidden="true" />
            {camper.location}
          </span>
        </div>
        <p className={styles.description}>{camper.description}</p>
        <div className={styles.features}>
          {features.map((feature) => (
            <span key={feature.label}>
              {feature.icon}
              {feature.label}
            </span>
          ))}
        </div>
        <Link
          href={`/catalog/${camper.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.more}
        >
          Show more
        </Link>
      </div>
    </article>
  );
}
