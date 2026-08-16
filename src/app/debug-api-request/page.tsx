import { redirect } from "next/navigation";

export default function DebugApiRequestPage() {
  redirect("/debug-api-request/broken");
}
