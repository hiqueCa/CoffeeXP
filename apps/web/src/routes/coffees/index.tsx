import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coffees/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coffees/"!</div>;
}
