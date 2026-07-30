import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brewings/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/brewings/new"!</div>;
}
