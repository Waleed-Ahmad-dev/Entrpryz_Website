import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Box, Sparkles } from "lucide-react";
import { PRODUCT_JOURNEY } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function ProductJourneySection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Product Innovation</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
              {PRODUCT_JOURNEY.headline}
            </h2>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.3}>
            <div className="space-y-4 text-base sm:text-lg text-text-secondary leading-relaxed">
              <p>{PRODUCT_JOURNEY.p1}</p>
              <p>{PRODUCT_JOURNEY.p2}</p>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.4}>
            <div className="doppelrand-card rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange" />
              <p className="text-lg font-display font-bold text-brand-orange uppercase tracking-wider">
                {PRODUCT_JOURNEY.motto}
              </p>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.5}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-background px-4 py-2 text-xs font-mono text-brand-amber">
                <Box className="h-4 w-4" />
                {PRODUCT_JOURNEY.status}
              </span>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-xs font-bold uppercase tracking-cta text-background hover:bg-brand-amber transition-colors"
              >
                <span>{PRODUCT_JOURNEY.cta}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </AnimateInView>
        </div>

        {/* Product Visual Card */}
        <div className="lg:col-span-5">
          <AnimateInView direction="left" delay={0.3}>
            <div className="relative aspect-square w-full rounded-2xl border-2 border-surface-border bg-background p-2.5 shadow-2xl group hover:border-brand-orange transition-colors duration-500">
              <div className="relative h-full w-full rounded-xl overflow-hidden bg-surface-dark scanline-overlay">
                <Image
                  src="/images/product-journey.jpg"
                  alt="Entrpryz Software Products"
                  fill
                  className="object-cover opacity-75 grayscale contrast-125 group-hover:opacity-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-surface-border bg-background/90 backdrop-blur-md">
                  <p className="text-xs uppercase font-mono font-bold text-brand-orange">
                    NEXT-GEN SAAS APPLICATIONS
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Purpose-built tools designed for mid-market efficiency.
                  </p>
                </div>
              </div>
            </div>
          </AnimateInView>
        </div>
      </div>
    </SectionContainer>
  );
}
