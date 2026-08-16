import { notFound } from "next/navigation";

import { getContractPrice } from "@/features/contract-price/api/service";
import { DetailPage } from "@/features/contract-price/detail";

type ContractPriceDetailRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContractPriceDetailRoute({
  params,
}: ContractPriceDetailRouteProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const contract = await getContractPrice(decodedId);
  if (!contract) notFound();

  return <DetailPage id={decodedId} />;
}
