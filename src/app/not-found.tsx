import ErrorPlaceholder from "@/components/common/error/ErrorPlaceholder";

export default function NotFound() {
  return (
    <div className="container mx-auto py-20">
      <ErrorPlaceholder 
        title="Page Not Found" 
        message="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        statusCode={404}
      />
    </div>
  );
}
