export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Multi-Vendor Marketplace Platform
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Welcome to the marketplace! This is a Next.js 16 application with
          TypeScript, Tailwind CSS, and modern best practices.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Next.js 16</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with the latest App Router and Server Components
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">TypeScript</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type-safe development with full TypeScript support
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:border-primary-500 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Tailwind CSS</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modern utility-first CSS framework with custom theme
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
