import type { Block, PageKey } from "@/lib/content-schema";
import { getPage } from "@/lib/pages";
import {
  CardsBlock,
  ChecklistBlock,
  CtaBlock,
  FaqBlock,
  GroupBlock,
  HeroBlock,
  ProfileBlock,
  ProseBlock,
  StatsBlock,
  StepsBlock,
  TagsBlock,
  TextBlock,
} from "./blocks";
import { ContactBlock } from "./contact-block";

function renderBlock(block: Block, dark: boolean) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "stats":
      return <StatsBlock block={block} dark={dark} />;
    case "cards":
      return <CardsBlock block={block} dark={dark} />;
    case "steps":
      return <StepsBlock block={block} dark={dark} />;
    case "checklist":
      return <ChecklistBlock block={block} dark={dark} />;
    case "faq":
      return <FaqBlock block={block} dark={dark} />;
    case "cta":
      return <CtaBlock block={block} />;
    case "profile":
      return <ProfileBlock block={block} dark={dark} />;
    case "text":
      return <TextBlock block={block} dark={dark} />;
    case "tags":
      return <TagsBlock block={block} dark={dark} />;
    case "group":
      return <GroupBlock block={block} dark={dark} />;
    case "prose":
      return <ProseBlock block={block} />;
    case "contact":
      return <ContactBlock block={block} />;
  }
}

/** Renders a page's blocks, alternating section backgrounds. */
export function PageBlocks({ page }: { page: PageKey }) {
  const { blocks } = getPage(page);
  let shade = 0;
  return (
    <>
      {blocks.map((block, i) => {
        const fullBleed = block.type === "hero" || block.type === "cta" || block.type === "prose" || block.type === "contact";
        const dark = !fullBleed && shade++ % 2 === 0;
        return <div key={i}>{renderBlock(block, dark)}</div>;
      })}
    </>
  );
}
