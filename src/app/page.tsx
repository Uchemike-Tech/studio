
import { LoginDialog } from '@/components/auth/login-dialog';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LoginDialog userType="student" />
          <LoginDialog userType="admin" />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamline Your University Clearance
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our portal simplifies the clearance process for students and
                    administrators at FUTO. Upload documents, track your
                    status, and get cleared faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <LoginDialog userType="student" />
                  <LoginDialog userType="admin" />
                </div>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8c2Nob29sfGVufDB8fHx8MTc1NTk1NDYwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="university campus"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need in One Place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From document submission to final verification, our portal is
                  designed to be intuitive, efficient, and secure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Student Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Easily upload documents and track your clearance status in
                  real-time.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Admin Panel</h3>
                <p className="text-sm text-muted-foreground">
                  Manage student applications, view analytics, and streamline
                  approvals.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">AI Document Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Leverage AI to automatically analyze documents and suggest
                  clearance statuses.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Secure File Handling</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are stored securely and handled with care.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">Status Indicators</h3>
                <p className="text-sm text-muted-foreground">
                  Clear visual cues for every step of your clearance journey.
                </p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">QR Code Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a unique QR code for your final clearance slip for
                  easy verification.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} FUTO Clearance Portal. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
