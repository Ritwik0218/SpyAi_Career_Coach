import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/components/loading-provider";
import { PageLoader } from "@/components/page-loader";
import { LoadingTopBar } from "@/components/loading-top-bar";
import { RouteTransitionEnhancer } from "@/components/route-transition-enhancer";
import { dark } from "@clerk/themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { LoadingDebugger } from "@/components/loading-debugger";

const inter = Inter({ 
  subsets: ["latin"], 
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "SPY AI - Your AI Career Coach",
  description: "Professional AI-powered career coaching platform. Get ATS-optimized resumes, personalized cover letters, mock interviews, and career guidance - completely FREE!",
  keywords: "SPY AI, AI career coach, ATS resume optimizer, cover letter generator, mock interviews, career guidance, job search, professional development",
  author: "Ritwik Mathur",
  robots: "index, follow",
  openGraph: {
    title: "SPY AI - Your AI Career Coach",
    description: "Professional AI-powered career coaching platform. Get ATS-optimized resumes, personalized cover letters, mock interviews, and career guidance - completely FREE!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPY AI - Your AI Career Coach",
    description: "Professional AI-powered career coaching platform. Get ATS-optimized resumes, personalized cover letters, mock interviews, and career guidance - completely FREE!",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/onboarding"
      afterSignUpUrl="/onboarding"
      afterSignOutUrl="/"
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              <LoadingTopBar />
              <Header />
              <PageLoader />
              <RouteTransitionEnhancer>
                <main className="min-h-screen">{children}</main>
              </RouteTransitionEnhancer>
              <Toaster richColors />
              <SpeedInsights />
              <Analytics />
              <LoadingDebugger />

              <footer className="bg-muted/50 py-12">
                <div className="container mx-auto px-4 text-center text-gray-200">
                  <p>Made with 💗 by <a href="https://www.linkedin.com/in/ritwik-mathur-53ba20255/" target="_blank" rel="noopener noreferrer" className="creator-name font-medium">Ritwik Mathur</a></p>
                </div>
              </footer>
            </LoadingProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
