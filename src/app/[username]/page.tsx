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
    .select("hook, username")
    .eq("username", params.username)
    .single();
  return {
    title: portfolio ? `${portfolio.hook} | Portfolio.ai` : "Portfolio",
    description: portfolio?.hook,
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

  const template = portfolio.template || "bold";

  if (template === "minimal") return <MinimalTemplate portfolio={portfolio as Portfolio} />;
  if (template === "creative") return <CreativeTemplate portfolio={portfolio as Portfolio} />;
  return <BoldTemplate portfolio={portfolio as Portfolio} />;
}
