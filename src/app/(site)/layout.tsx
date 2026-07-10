import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { IntroAnimation } from "@/components/site/intro-animation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <IntroAnimation />
      <Navbar />
      {/* No top padding here — hero is full-height and handles its own pt-20.
          Other pages use PageBanner which has its own top padding via pt-16 spacer below. */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
