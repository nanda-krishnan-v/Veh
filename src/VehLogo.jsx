import React from "react";

export default function VehLogo({ className = "w-16 h-16" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="url(#gradient1)"
        strokeWidth="3"
        fill="none"
        opacity="0.8"
      />
      <circle
        cx="200"
        cy="200"
        r="170"
        stroke="url(#gradient1)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Circuit Pattern Background */}
      <g opacity="0.3">
        <line
          x1="150"
          y1="150"
          x2="170"
          y2="150"
          stroke="url(#gradient2)"
          strokeWidth="1"
        />
        <circle cx="170" cy="150" r="2" fill="url(#gradient2)" />
        <line
          x1="170"
          y1="150"
          x2="185"
          y2="135"
          stroke="url(#gradient2)"
          strokeWidth="1"
        />

        <line
          x1="250"
          y1="160"
          x2="270"
          y2="160"
          stroke="url(#gradient2)"
          strokeWidth="1"
        />
        <circle cx="270" cy="160" r="2" fill="url(#gradient2)" />

        <line
          x1="180"
          y1="220"
          x2="160"
          y2="240"
          stroke="url(#gradient2)"
          strokeWidth="1"
        />
        <circle cx="160" cy="240" r="2" fill="url(#gradient2)" />

        <line
          x1="280"
          y1="210"
          x2="300"
          y2="220"
          stroke="url(#gradient2)"
          strokeWidth="1"
        />
        <circle cx="300" cy="220" r="2" fill="url(#gradient2)" />
      </g>

      {/* Car Silhouette */}
      <g transform="translate(80, 160)">
        {/* Car Body */}
        <path
          d="M20,40 L40,20 L160,20 L180,40 L220,40 L220,80 L20,80 Z"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Car Windows */}
        <path
          d="M50,25 L50,40 L90,40 L90,25 Z"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M100,25 L100,40 L150,40 L165,25 Z"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
        />

        {/* Front Wheel */}
        <circle
          cx="60"
          cy="80"
          r="18"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="60"
          cy="80"
          r="10"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="60" cy="80" r="4" fill="url(#gradient1)" />

        {/* Back Wheel */}
        <circle
          cx="180"
          cy="80"
          r="18"
          stroke="url(#gradient2)"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="180"
          cy="80"
          r="10"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="180" cy="80" r="4" fill="url(#gradient2)" />

        {/* Tech Details */}
        <circle cx="120" cy="50" r="3" fill="url(#gradient1)" />
        <line
          x1="120"
          y1="50"
          x2="130"
          y2="50"
          stroke="url(#gradient1)"
          strokeWidth="1.5"
        />
        <circle cx="130" cy="50" r="2" fill="url(#gradient1)" />

        {/* Hexagon patterns */}
        <path
          d="M140,45 L145,48 L145,54 L140,57 L135,54 L135,48 Z"
          stroke="url(#gradient1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M155,48 L160,51 L160,57 L155,60 L150,57 L150,51 Z"
          stroke="url(#gradient2)"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* VEH Text */}
      <text
        x="200"
        y="300"
        fontFamily="Arial, sans-serif"
        fontSize="52"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#gradient1)"
      >
        veh
      </text>

      {/* Subtitle */}
      <text
        x="200"
        y="330"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="600"
        textAnchor="middle"
        fill="url(#gradient1)"
        letterSpacing="2"
      >
        DIGITAL CAR REGISTRY
      </text>
      <text
        x="200"
        y="348"
        fontFamily="Arial, sans-serif"
        fontSize="12"
        fontWeight="500"
        textAnchor="middle"
        fill="url(#gradient2)"
      >
        DApp
      </text>

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
