import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mohalla — your neighbourhood, online",
    short_name: "Mohalla",
    description: "Hyperlocal feed, services, circles, and marketplace for your street.",
    start_url: "/feed",
    display: "standalone",
    background_color: "#eff1ec",
    theme_color: "#c65a24",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
