import { notFound } from "next/navigation";

import { getCatalog } from "@/features/catalog-ho/api/service";
import { DetailPage } from "@/features/catalog-ho/detail";

type CatalogDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CatalogDetailRoute({
  params,
}: CatalogDetailRouteProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const catalog = await getCatalog(decodedId);
  if (!catalog) notFound();

  return <DetailPage id={decodedId} />;
}
