<script setup lang="ts">
usePageSeo({
  title: 'Weight 2 FIT - Generate Weight Scale FIT Files',
  description: 'Import body composition data into any device that supports FIT files. Generate FIT-format files from your metrics instantly.',
  ogDescription: 'Generate Weight Scale FIT files from your body composition data. Import metrics into any FIT-compatible device or fitness app.'
})

useSchemaOrg([
  defineWebSite({
    name: 'Weight 2 FIT',
    url: 'https://weight2fit.marcelorodrigo.com'
  }),
  defineWebPage({
    name: 'Weight 2 FIT - Generate Weight Scale FIT Files',
    description: 'Import body composition data into any device that supports FIT files. Generate FIT-format files from your metrics instantly.'
  }),
  defineOrganization({
    name: 'Weight 2 FIT',
    url: 'https://weight2fit.marcelorodrigo.com',
    logo: 'https://weight2fit.marcelorodrigo.com/favicon.svg',
    sameAs: ['https://github.com/marcelorodrigo/weight2fit']
  })
])
</script>

<template>
  <div>
    <UPageHero
      description="Import body composition data into any device that supports FIT files. Generate FIT-format files from your metrics."
      :links="[{
        label: 'Try Weight Tool',
        to: '/weight',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'View on GitHub',
        to: 'https://github.com/marcelorodrigo/weight2fit',
        target: '_blank',
        icon: 'i-simple-icons-github',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    >
      <template #title>
        <span class="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
          Weight 2 FIT
        </span>
      </template>
    </UPageHero>

    <UPageSection
      id="core"
      title="Core Feature"
      description="Start with the Weight Scale FIT Generator"
      :features="[{
        icon: 'i-lucide-scale',
        title: 'Weight Scale FIT Generator',
        description: 'Input your body composition metrics (weight, body fat %, muscle mass, etc.) and generate a standard FIT file you can import into any compatible device or fitness app.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to get started?"
        description="Generate your first Weight Scale FIT file in seconds."
        :links="[{
          label: 'Go to Weight Tool',
          to: '/weight',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'neutral'
        }]"
      />
    </UPageSection>
  </div>
</template>
