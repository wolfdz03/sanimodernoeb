import { createServiceClient } from "@/lib/supabase/service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryForm } from "../CategoryForm";
import { updateCategory, deleteCategory } from "@/app/actions/categories";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardCategoryEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !category) notFound();

  return (
    <div>
      <Link
        href="/dashboard/categories"
        className="text-sm text-[#2563EB] hover:underline mb-4 inline-block"
      >
        ← Retour aux catégories
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">
        Modifier la catégorie
      </h1>
      <CategoryForm
        action={updateCategory.bind(null, id)}
        category={category}
        deleteAction={deleteCategory.bind(null, id)}
      />
    </div>
  );
}
