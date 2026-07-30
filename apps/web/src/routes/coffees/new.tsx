import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/coffees/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/coffees/new"!</div>;
}
