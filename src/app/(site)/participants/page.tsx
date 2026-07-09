import { getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/site/page-banner";
import { ParticipantLookup } from "@/components/site/participants/participant-lookup";
import { Search } from "lucide-react";

export const metadata = {
  title: "Participant Lookup",
  description: "Find your competition details using your chest number and date of birth.",
};

export default async function ParticipantsPage() {
  const [bannerImage] = await getGallery(1);

  return (
    <>
      <PageBanner
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Participant Lookup" }]}
        title="Participant Lookup"
        description="Enter your chest number and date of birth to view your competition details."
        imageUrl={bannerImage?.imageUrl}
        stats={[
          { icon: Search, value: "Instant", label: "Live from API" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <ParticipantLookup />
      </div>
    </>
  );
}
