import Link from "next/link";
import { CategoryForm } from "../CategoryForm";
import { createCategory } from "@/app/actions/categories";

export default function DashboardCategoryNouveauPage() {
  return (
    <div>
      <Link
        href="/dashboard/categories"
        className="text-sm text-[#2563EB] hover:underline mb-4 inline-block"
      >
        ← Retour aux catégories
      </Link>
      <h1 className="font-bold text-2xl text-[#1E293B] mb-6">
        Nouvelle catégorie
      </h1>
      <CategoryForm action={createCategory} category={null} />
    </div>
  );
}
