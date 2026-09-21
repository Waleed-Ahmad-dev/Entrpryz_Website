import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";
import { PRODUCT_JOURNEY } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function ProductJourneySection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <Sparkles className="h-4 w-4" />
            <span>Product Innovation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase leading-tight">
            {PRODUCT_JOURNEY.headline}
          </h2>

          <div className="space-y-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            <p>{PRODUCT_JOURNEY.p1}</p>
            <p>{PRODUCT_JOURNEY.p2}</p>
          </div>

          <div className="border-l-4 border-brand-orange bg-background p-6">
            <p className="text-lg font-bold text-brand-orange uppercase tracking-wider">
              {PRODUCT_JOURNEY.motto}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <span className="inline-flex items-center gap-2 border border-surface-border bg-background px-4 py-2 text-xs font-mono text-brand-amber">
              <Box className="h-4 w-4" />
              {PRODUCT_JOURNEY.status}
            </span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-orange px-6 py-2.5 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-colors"
            >
              <span>{PRODUCT_JOURNEY.cta}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Product Visual Card */}
        <div className="lg:col-span-5">
          <div className="relative aspect-square w-full border-2 border-surface-border bg-background p-2 shadow-2xl">
            <div className="relative h-full w-full overflow-hidden bg-surface-dark">
              <Image
                src="/images/product-journey.jpg"
                alt="Entrpryz Software Products"
                fill
                className="object-cover opacity-75 grayscale contrast-125 hover:opacity-95 hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 border border-surface-border bg-background/90 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-label font-bold text-brand-orange">
                  Next-Gen SaaS Applications
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Purpose-built tools designed for mid-market efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
