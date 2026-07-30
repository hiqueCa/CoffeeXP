import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/brewings/$brewingId/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/brewings/$brewingId/$"!</div>
}
