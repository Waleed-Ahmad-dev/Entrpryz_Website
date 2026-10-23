import { PageBlocks } from "@/components/blocks/page-blocks";
import { pageMetadata } from "@/lib/pages";

export const metadata = pageMetadata("servicesPage");

export default function Page() {
  return <PageBlocks page="servicesPage" />;
}
