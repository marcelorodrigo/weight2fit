export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'cyan',
      neutral: 'zinc'
    },
    pageHero: {
      slots: {
        container: 'py-12 sm:py-20 lg:py-32',
        title: 'text-4xl sm:text-6xl lg:text-7xl',
        description: 'text-base sm:text-xl/8',
        links: '[&>a]:min-h-11 [&>button]:min-h-11'
      }
    },
    pageSection: {
      slots: {
        container: 'py-10 sm:py-16 lg:py-24'
      }
    },
    inputNumber: {
      slots: {
        root: 'w-full',
        base: 'min-h-11',
        increment: '[&>button]:size-11',
        decrement: '[&>button]:size-11'
      },
      defaultVariants: {
        size: 'xl'
      }
    }
  },
  seo: {
    siteName: 'Weight 2 FIT',
    siteDescription: 'Generate Weight Scale FIT files from your body composition data. Import metrics into any FIT-compatible device or fitness app.',
    siteUrl: 'https://weight2fit.marcelorodrigo.com',
    author: 'Weight 2 FIT',
    keywords: 'weight scale, FIT file, fitness data, body composition, health metrics, Garmin',
    twitterHandle: '@weight2fit'
  }
})
