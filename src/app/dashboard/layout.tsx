"use client";

import type React from "react";

import { useEffect, useState } from "react";

async function enableMocking() {
    // Only enable MSW in development
    if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_MSW_ENABLED !== "true") {
      return Promise.resolve(true)
    }
  
    try {
      // Import the MSW initialization module
      const { default: initMocks } = await import("../../mocks")
  
      // Initialize MSW
      await initMocks()
  
      return true
    } catch (error) {
      console.error("Error initializing MSW:", error)
      // Return true anyway to not block rendering
      return true
    }
  }

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMswReady, setIsMswReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Initialize MSW when the component mounts
    enableMocking().then((ready) => {
      setIsMswReady(ready)
    })
  }, [])

  if (!isMswReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
