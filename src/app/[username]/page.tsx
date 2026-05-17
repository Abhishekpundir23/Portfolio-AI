import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import BoldTemplate from "@/app/components/templates/BoldTemplate";
import MinimalTemplate from "@/app/components/templates/MinimalTemplate";
import CreativeTemplate from "@/app/components/templates/CreativeTemplate";
import type { Portfolio } from "@/types/portfolio";
import type { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("hook, username, problem, win, tech_stack")
    .eq("username", params.username)
    .single();

  if (!portfolio) {
    return { title: "Portfolio Not Found" };
  }

  const title = `${portfolio.hook} | Portfolio.ai`;
  const description = `${portfolio.problem?.split('.')[0]}. Result: ${portfolio.win?.split('.')[0]}.`;
  const tools = portfolio.tech_stack?.slice(0, 4).join(", ") || "";
  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-ai-ten-silk.vercel.app"}/api/og?title=${encodeURIComponent(portfolio.hook)}&username=${encodeURIComponent(portfolio.username)}&tools=${encodeURIComponent(tools)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${portfolio.username}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: portfolio.hook }],
      siteName: "Portfolio.ai",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicPortfolio(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: portfolio, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error || !portfolio) notFound();

  // Increment view counter in the background
  supabase.rpc('increment_portfolio_views', { portfolio_id: portfolio.id }).then();

  const template = portfolio.template || "bold";

  if (template === "minimal") return <MinimalTemplate portfolio={portfolio as Portfolio} />;
  if (template === "creative") return <CreativeTemplate portfolio={portfolio as Portfolio} />;
  return <BoldTemplate portfolio={portfolio as Portfolio} />;
}
