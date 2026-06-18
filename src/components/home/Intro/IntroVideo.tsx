// Homepage hero promo. Poster + native controls; the 3-min clip (hosted on the
// Sanity CDN) downloads only when the visitor presses play (preload="none").
const PROMO_VIDEO_URL =
  "https://cdn.sanity.io/files/9ped5k0o/production/3c6108e21d69631b747c5ef5819e8ec79128f50c.mp4";
const POSTER_SRC = "/home/promo-poster.jpg";

type Props = { label: string };

export function IntroVideo({ label }: Props) {
  return (
    <div className="ho-intro__visual">
      <video
        className="ho-intro__media"
        src={PROMO_VIDEO_URL}
        poster={POSTER_SRC}
        aria-label={label}
        controls
        preload="none"
        playsInline
      />
    </div>
  );
}
