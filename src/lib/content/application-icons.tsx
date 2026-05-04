import type { ReactNode } from "react";

export const INDUSTRY_ICONS: Record<string, ReactNode> = {
  semiconductor: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <line x1="9" y1="7" x2="9" y2="5" />
      <line x1="12" y1="7" x2="12" y2="5" />
      <line x1="15" y1="7" x2="15" y2="5" />
      <line x1="9" y1="17" x2="9" y2="19" />
      <line x1="12" y1="17" x2="12" y2="19" />
      <line x1="15" y1="17" x2="15" y2="19" />
      <line x1="7" y1="9" x2="5" y2="9" />
      <line x1="7" y1="12" x2="5" y2="12" />
      <line x1="7" y1="15" x2="5" y2="15" />
      <line x1="17" y1="9" x2="19" y2="9" />
      <line x1="17" y1="12" x2="19" y2="12" />
      <line x1="17" y1="15" x2="19" y2="15" />
    </svg>
  ),

  "fuel-cells": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="13 2 4.5 13 11 13 9 22 19.5 11 13 11 13 2" />
    </svg>
  ),

  "biotech-pharmaceutical": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 3h6" />
      <path d="M10 3v6.5L6 16a2 2 0 001.8 2.9h8.4A2 2 0 0018 16l-4-6.5V3" />
      <line x1="7.5" y1="15" x2="16.5" y2="15" />
    </svg>
  ),

  "chemical-petrochemical": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)" />
    </svg>
  ),

  "precision-gas-blending": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="8" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="10" cy="18" r="2" />
    </svg>
  ),

  "research-development": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  ),

  "metals-processing": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="3" rx="0.5" />
      <rect x="4" y="10.5" width="16" height="3" rx="0.5" />
      <rect x="4" y="17" width="16" height="3" rx="0.5" />
    </svg>
  ),

  "led-lighting": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 017 7c0 2.5-1.3 4.7-3.2 6H8.2A7 7 0 0112 2z" />
    </svg>
  ),

  "solar-photovoltaic": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  ),

  "fiber-optics": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" opacity="0.4" />
    </svg>
  ),

  "surface-treatment": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  ),

  "leak-detection": (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2.5C12 2.5 5 10 5 14.5a7 7 0 0014 0C19 10 12 2.5 12 2.5z" />
    </svg>
  ),
};
