import { useSearchParams } from "react-router-dom";

export function ReviewPage() {
  const params = useSearchParams();

  return (
    <div>
      <h1>Card Collection Page</h1>
      <p>Welcome to the card collection page!</p>
      {JSON.stringify(params)}
    </div>
  );
}
