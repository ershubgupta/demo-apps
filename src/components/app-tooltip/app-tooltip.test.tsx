import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppTooltip } from "@/components/app-tooltip";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

describe("AppTooltip", () => {
  it("uses tooltip behavior on pointer devices", async () => {
    mockMatchMedia(false);

    render(
      <AppTooltip content="Helpful context">
        <button type="button">Details</button>
      </AppTooltip>
    );

    await waitFor(() => {
      expect(window.matchMedia).toHaveBeenCalled();
    });

    expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
      "data-slot",
      "tooltip-trigger"
    );
  });

  it("opens content on tap for touch devices", async () => {
    const user = userEvent.setup();
    mockMatchMedia(true);

    render(
      <AppTooltip content="Helpful context">
        <button type="button">Details</button>
      </AppTooltip>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
        "data-slot",
        "popover-trigger"
      );
    });

    await user.click(screen.getByRole("button", { name: "Details" }));

    expect(screen.getByText("Helpful context")).toBeInTheDocument();
  });
});
