"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
          background: "#f6f7f9",
          color: "#181c26",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "#6b7485",
              margin: 0,
              marginBottom: 12,
            }}
          >
            500 · LINE TECH
          </p>
          <h1 style={{ fontSize: 28, margin: "0 0 12px", fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ margin: "0 0 24px", color: "#4c5566", lineHeight: 1.55 }}>
            We couldn&rsquo;t load this page. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 500,
              background: "#185686",
              color: "#fff",
              border: 0,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontFamily: "ui-monospace, Menlo, monospace",
                fontSize: 12,
                color: "#97a0b0",
              }}
            >
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
