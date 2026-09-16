export function LoadingSpinner() {
  return (
    <div
      className="flex justify-center items-center w-full"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando..."
    >
      <div
        className="size-9 border-5 border-accent-100 border-t-background-700 rounded-full animate-spin"
        style={{ animationDuration: "0.8s" }}
      />
    </div>
  );
}
