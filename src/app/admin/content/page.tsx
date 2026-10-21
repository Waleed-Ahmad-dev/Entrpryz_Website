import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContentEditor } from "@/components/admin/content-editor";
import { getAdminSession } from "@/lib/admin-auth";
import { siteContentSchema } from "@/lib/content-schema";
import { SITE_CONTENT } from "@/lib/site-content";
import { CONTENT_PATH, isGitHubConfigured, readRepoFile } from "@/lib/github-store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content" };

type LoadResult = { content: unknown; sha: string | null; warning: string | null };

/** Latest content from GitHub (may be ahead of this deploy); falls back to the bundled copy. */
async function loadContent(): Promise<LoadResult> {
  if (!isGitHubConfigured()) {
    return {
      content: SITE_CONTENT,
      sha: null,
      warning: "Publishing is not configured: set GITHUB_TOKEN and GITHUB_REPO. Showing the deployed content read-only.",
    };
  }
  try {
    const file = await readRepoFile(CONTENT_PATH);
    const parsed = siteContentSchema.safeParse(JSON.parse(file.text));
    if (!parsed.success) {
      return {
        content: SITE_CONTENT,
        sha: null,
        warning: `${CONTENT_PATH} on GitHub is invalid, so editing is disabled. Fix it in the repository first.`,
      };
    }
    return { content: parsed.data, sha: file.sha, warning: null };
  } catch (err) {
    console.error("[admin] content load failed:", err instanceof Error ? err.message : "unknown");
    return {
      content: SITE_CONTENT,
      sha: null,
      warning: "Couldn't reach GitHub, so publishing is disabled. Showing the deployed content read-only.",
    };
  }
}

export default async function AdminContentPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { content, sha, warning } = await loadContent();

  return (
    <AdminShell username={session.sub}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">
            Website Content
          </h1>
          <p className="text-sm text-text-secondary max-w-2xl">
            Every edit is validated, committed to GitHub and redeployed by Vercel — changes appear on the
            live site about 1–2 minutes after publishing.
          </p>
        </div>
        {warning && (
          <p className="flex items-start gap-2 border border-brand-orange/40 px-4 py-3 text-xs text-brand-orange">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{warning}</span>
          </p>
        )}
        <ContentEditor
          initialContent={JSON.parse(JSON.stringify(content))}
          initialSha={sha}
          canSave={sha !== null}
        />
      </div>
    </AdminShell>
  );
}
