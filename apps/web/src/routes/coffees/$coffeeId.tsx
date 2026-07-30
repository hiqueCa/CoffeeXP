import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coffees/$coffeeId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coffees/$coffeeId"!</div>;
}
