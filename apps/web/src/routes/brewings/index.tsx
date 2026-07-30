import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/brewings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/brewings/"!</div>;
}
