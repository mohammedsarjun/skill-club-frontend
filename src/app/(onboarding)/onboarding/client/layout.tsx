import ClientOnboardingGuard from "@/components/guards/ClientOnboardingGuard";

export default function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: any;
}) {
  return (
    <ClientOnboardingGuard>
      <div className="min-h-screen flex items-start justify-center bg-gray-100 px-4 mt-20">
        <div className="w-full max-w-7xl bg-white shadow-lg rounded-2xl p-8">
          {children}
          
        </div>
      </div>
    </ClientOnboardingGuard>
  );
}
