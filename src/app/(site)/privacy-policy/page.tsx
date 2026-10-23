import { PageBlocks } from "@/components/blocks/page-blocks";
import { pageMetadata } from "@/lib/pages";

export const metadata = pageMetadata("privacyPage");

export default function Page() {
  return <PageBlocks page="privacyPage" />;
}
