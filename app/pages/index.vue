<script setup lang="ts">
usePageSeo({
  title: 'Weight 2 FIT - Generate Weight Scale FIT Files',
  description: 'Import body composition data into any device that supports FIT files. Generate FIT-format files from your metrics instantly.',
  ogDescription: 'Generate Weight Scale FIT files from your body composition data. Import metrics into any FIT-compatible device or fitness app.'
})

const siteConfig = useSiteConfig()
const siteUrl = siteConfig.url

useSchemaOrg([
  defineWebSite({
    name: 'Weight 2 FIT',
    url: siteUrl
  }),
  defineWebPage({
    name: 'Weight 2 FIT - Generate Weight Scale FIT Files',
    description: 'Import body composition data into any device that supports FIT files. Generate FIT-format files from your metrics instantly.'
  }),
  defineOrganization({
    name: 'Weight 2 FIT',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
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
        <span class="animate-shimmer bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent bg-[length:200%_100%]">
          Weight 2 FIT
        </span>
      </template>
    </UPageHero>

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
