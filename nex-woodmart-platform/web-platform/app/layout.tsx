import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NEX WoodMart Platform',
  description: 'AI-powered WordPress/WoodMart management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
