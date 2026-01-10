import React from "react";
import AuthHeader from "@/components/common/AuthHeader";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import "./globals.css";

import Script from "next/script";
import { persistor } from "@/store";
import RouteLoader from "../components/common/RouteLoader";
import GlobalSpinner from "@/components/common/Spinner";
import "react-quill-new/dist/quill.snow.css";
import ClientInit from "@/components/UserInit";
import { SocketProvider } from "@/hooks/useSocket";

export default function Layout({ children, params }: { children: React.ReactNode; params?: any }) {
  return (
    <html>
      <body className="bg-gray-50 min-h-screen text-gray-900 font-sans">
          <Providers>
            <SocketProvider>
              <RouteLoader />
              <ClientInit />
              <GlobalSpinner />
              <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <script
                src="https://accounts.google.com/gsi/client"
                async
                defer
              ></script>
              <Toaster position="top-right" reverseOrder={false} />
            </SocketProvider>
          </Providers>
      </body>
    </html>
  );
}
