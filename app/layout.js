import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import ClientThemeProvider from '../components/ClientThemeProvider'; // Import the client-side theme provider
import Link from 'next/link'; // Import the Link component

export default function RootLayout({ children }) {
  const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <html lang="en">
        <body>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem', // Maintain the original height
            backgroundColor: '#3f51b5',
            color: '#fff',
            borderBottom: '2px solid #ffffff22'
          }}>
            <Link href="/" passHref>
              <h1 style={{
                margin: 0,
                fontSize: '1.5rem', // Keep the original font size
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }}>
                SnapCards
              </h1>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <ClientThemeProvider>
            <main>
              <div className="content-body">
                {children} {/* Render page content here */}
              </div>
            </main>
          </ClientThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
