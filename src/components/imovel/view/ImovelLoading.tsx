import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const ImovelLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
};