import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/brewings/$brewingId/edit")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/brewings_/$brewingId/edit"!</div>
}
