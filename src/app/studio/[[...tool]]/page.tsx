import { NextStudio } from "next-sanity/studio";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export const metadata = {
  ...studioMetadata,
  robots: { index: false, follow: false },
};

export { viewport };

export default function StudioPage() {
  return <NextStudio config={config} />;
}
