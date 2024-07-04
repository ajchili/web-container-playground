import { memo } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { WebContainer } from "../components/WebContainer/WebContainer.js";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <WebContainer />
    </div>
  );
}
