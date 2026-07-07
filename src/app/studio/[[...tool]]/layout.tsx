// Server layout for the embedded Studio: owns route metadata/config so the
// page itself can be a pure client component (keeps `sanity` out of the RSC
// graph, where swr's react-server build breaks under Next 16).
export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
