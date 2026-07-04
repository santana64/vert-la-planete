"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { products, sellers } from "@/db/schema";
import { requireSeller } from "@/lib/auth";
import { BADGES, CATEGORIES, FREE_PRODUCT_LIMIT, GRADIENTS, REGIONS } from "@/lib/constants";
import { slugify } from "@/lib/format";
import { getSellerProductCount } from "@/lib/queries";

export type SellerFormState = { error?: string; ok?: boolean };

function parsePriceToCents(input: FormDataEntryValue | null): number | null {
  if (typeof input !== "string") return null;
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

const productSchema = z.object({
  name: z.string().trim().min(2, "Nom du produit trop court"),
  description: z.string().trim().min(10, "Description trop courte"),
  category: z.enum(CATEGORIES),
  badge: z.union([z.enum(BADGES), z.literal("")]).optional(),
  unit: z.string().trim().max(16).optional(),
  gradient: z.string().trim().optional(),
  isNew: z.boolean().optional()
});

async function uniqueProductSlug(base: string): Promise<string> {
  const root = slugify(base) || "produit";
  let slug = root;
  let i = 1;
  while (true) {
    const [exists] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!exists) return slug;
    slug = `${root}-${++i}`;
  }
}

export async function createProductAction(
  _prev: SellerFormState,
  formData: FormData
): Promise<SellerFormState> {
  const { seller } = await requireSeller();

  // Accès restreint selon l'offre (article 2.3) : limite de produits en offre gratuite.
  if (seller.offer === "gratuit") {
    const count = await getSellerProductCount(seller.id);
    if (count >= FREE_PRODUCT_LIMIT) {
      return {
        error: `L'offre Gratuite est limitée à ${FREE_PRODUCT_LIMIT} produits. Passez à l'offre Pro pour en publier davantage.`
      };
    }
  }

  const priceCents = parsePriceToCents(formData.get("price"));
  if (priceCents === null) return { error: "Prix invalide" };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    badge: formData.get("badge") ?? "",
    unit: formData.get("unit") ?? "",
    gradient: formData.get("gradient") ?? "",
    isNew: formData.get("isNew") === "on"
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;
  const slug = await uniqueProductSlug(data.name);

  await db.insert(products).values({
    sellerId: seller.id,
    slug,
    name: data.name,
    description: data.description,
    priceCents,
    unit: data.unit ? data.unit : null,
    category: data.category,
    badge: data.badge ? data.badge : null,
    gradient: data.gradient || GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    isNew: data.isNew ?? true
  });

  revalidatePath("/espace-partenaire/produits");
  revalidatePath(`/partenaires/${seller.slug}`);
  redirect("/espace-partenaire/produits");
}

export async function updateProductAction(
  _prev: SellerFormState,
  formData: FormData
): Promise<SellerFormState> {
  const { seller } = await requireSeller();
  const productId = z.string().uuid().safeParse(formData.get("productId"));
  if (!productId.success) return { error: "Produit invalide" };

  const [owned] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, productId.data), eq(products.sellerId, seller.id)))
    .limit(1);
  if (!owned) return { error: "Produit introuvable" };

  const priceCents = parsePriceToCents(formData.get("price"));
  if (priceCents === null) return { error: "Prix invalide" };

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    badge: formData.get("badge") ?? "",
    unit: formData.get("unit") ?? "",
    gradient: formData.get("gradient") ?? "",
    isNew: formData.get("isNew") === "on"
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;

  await db
    .update(products)
    .set({
      name: data.name,
      description: data.description,
      priceCents,
      unit: data.unit ? data.unit : null,
      category: data.category,
      badge: data.badge ? data.badge : null,
      gradient: data.gradient || undefined,
      isNew: data.isNew ?? false
    })
    .where(eq(products.id, productId.data));

  revalidatePath("/espace-partenaire/produits");
  revalidatePath(`/partenaires/${seller.slug}`);
  redirect("/espace-partenaire/produits");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const { seller } = await requireSeller();
  const productId = z.string().uuid().safeParse(formData.get("productId"));
  if (!productId.success) return;
  await db
    .delete(products)
    .where(and(eq(products.id, productId.data), eq(products.sellerId, seller.id)));
  revalidatePath("/espace-partenaire/produits");
  revalidatePath(`/partenaires/${seller.slug}`);
}

const profileSchema = z.object({
  name: z.string().trim().min(2),
  category: z.enum(CATEGORIES),
  tagline: z.string().trim().min(4),
  description: z.string().trim().min(10),
  city: z.string().trim().min(2),
  region: z.enum(REGIONS),
  websiteUrl: z.union([z.string().trim().url("URL invalide"), z.literal("")]).optional()
});

export async function updateSellerProfileAction(
  _prev: SellerFormState,
  formData: FormData
): Promise<SellerFormState> {
  const { seller } = await requireSeller();
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    city: formData.get("city"),
    region: formData.get("region"),
    websiteUrl: formData.get("websiteUrl") ?? ""
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const { websiteUrl, ...rest } = parsed.data;
  await db
    .update(sellers)
    .set({
      ...rest,
      websiteUrl: websiteUrl ? websiteUrl : null,
      logoInitials: rest.name.slice(0, 2).toUpperCase()
    })
    .where(eq(sellers.id, seller.id));

  revalidatePath("/espace-partenaire");
  revalidatePath(`/partenaires/${seller.slug}`);
  return { ok: true };
}
