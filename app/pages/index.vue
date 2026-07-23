<script setup lang="ts">
const pageTitle = 'Create Garmin Weight FIT Files Privately'
const pageDescription = 'Turn body composition measurements into a Garmin-compatible weight scale FIT file entirely in your browser—no account credentials or server uploads.'

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  ogDescription: 'Create Garmin-compatible Weight Scale FIT files from your body composition data. Private, browser-based, and open source.'
})

const siteConfig = useSiteConfig()
const siteUrl = siteConfig.url

useSchemaOrg([
  defineWebSite({
    name: 'Weight 2 FIT',
    url: siteUrl
  }),
  defineWebPage({
    name: pageTitle,
    description: pageDescription
  }),
  defineSoftwareApp({
    name: 'Weight 2 FIT',
    description: pageDescription,
    url: `${siteUrl}/weight`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any'
  }),
  defineOrganization({
    name: 'Weight 2 FIT',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    sameAs: ['https://github.com/marcelorodrigo/weight2fit']
  })
])

const trustSignals = [{
  label: '100% in your browser',
  icon: 'i-lucide-monitor-check'
}, {
  label: 'No Garmin credentials',
  icon: 'i-lucide-key-round'
}, {
  label: 'Open source',
  icon: 'i-lucide-code-xml'
}, {
  label: 'Standard FIT format',
  icon: 'i-lucide-file-check-2'
}]

const benefits = [{
  title: 'Private by design',
  description: 'Your body composition data is processed locally and never sent to a Weight 2 FIT server.',
  icon: 'i-lucide-shield-check'
}, {
  title: 'Your account stays secure',
  description: 'Generate files without sharing your Garmin password or weakening two-factor authentication.',
  icon: 'i-lucide-lock-keyhole'
}, {
  title: 'Built on the FIT standard',
  description: 'Create a standard Weight Scale FIT file using the official Garmin JavaScript FIT SDK.',
  icon: 'i-lucide-file-check-2'
}]

const workflowSteps = [{
  title: 'Enter your measurements',
  description: 'Add weight and any optional body composition metrics reported by your scale.',
  icon: 'i-lucide-scale'
}, {
  title: 'Generate and download',
  description: 'Weight 2 FIT creates the file locally and downloads it directly to your device.',
  icon: 'i-lucide-file-down'
}, {
  title: 'Import into Garmin Connect',
  description: 'Upload the .fit file from Garmin Connect’s Body Composition page.',
  icon: 'i-lucide-cloud-upload'
}]

const tools = [{
  title: 'Weight Tool',
  description: 'Create a Weight Scale FIT file from weight, body fat, muscle mass, hydration, and more.',
  icon: 'i-lucide-scale',
  to: '/weight',
  highlight: true
}, {
  title: 'FIT Viewer',
  description: 'Open a FIT file locally to inspect its messages, fields, and metadata.',
  icon: 'i-lucide-file-search',
  to: '/viewer',
  highlight: false
}, {
  title: 'Fields Guide',
  description: 'Understand every body composition field supported by the generator.',
  icon: 'i-lucide-list-tree',
  to: '/fields',
  highlight: false
}]
</script>

<template>
  <div>
    <UPageHero
      orientation="horizontal"
      class="overflow-hidden"
      description="Turn body composition measurements into a Garmin-compatible Weight Scale FIT file. Everything happens on your device—no account credentials and no server uploads."
      :links="[{
        label: 'Create a FIT file',
        to: '/weight',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'How it works',
        to: '#how-it-works',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
      :ui="{
        container: 'lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]',
        title: 'lg:text-6xl',
        body: 'mt-8',
        footer: 'mt-8'
      }"
    >
      <template #headline>
        <UBadge
          label="Private by design · Free to use"
          icon="i-lucide-shield-check"
          variant="subtle"
          size="lg"
        />
      </template>

      <template #title>
        Create Garmin-ready FIT files from your
        <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          body data.
        </span>
      </template>

      <template #body>
        <ul class="grid grid-cols-1 gap-x-4 gap-y-3 text-sm text-toned sm:grid-cols-2">
          <li
            v-for="signal in trustSignals"
            :key="signal.label"
            class="flex items-center gap-2"
          >
            <UIcon
              :name="signal.icon"
              class="size-4 shrink-0 text-primary"
            />
            <span>{{ signal.label }}</span>
          </li>
        </ul>
      </template>

      <div class="relative mx-auto w-full max-w-lg">
        <div
          aria-hidden="true"
          class="absolute -inset-8 -z-10 rounded-full bg-primary/10 blur-3xl"
        />

        <div class="overflow-hidden rounded-2xl bg-elevated/70 shadow-2xl ring ring-default backdrop-blur">
          <div class="flex items-center justify-between gap-3 border-b border-muted px-4 py-3 sm:px-5">
            <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
              <span class="size-2 rounded-full bg-success" />
              Private conversion
            </div>
            <UBadge
              label="On this device"
              icon="i-lucide-laptop"
              color="neutral"
              variant="subtle"
            />
          </div>

          <div class="grid items-center gap-3 p-5 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-2 sm:p-6">
            <div class="rounded-xl bg-default p-4 text-center ring ring-default">
              <UIcon
                name="i-lucide-scale"
                class="mx-auto size-7 text-primary"
              />
              <p class="mt-3 text-sm font-semibold text-highlighted">
                Scale readings
              </p>
              <p class="mt-1 text-xs text-muted">
                Weight, fat, muscle
              </p>
            </div>

            <UIcon
              name="i-lucide-arrow-right"
              aria-hidden="true"
              class="mx-auto size-5 rotate-90 text-dimmed sm:rotate-0"
            />

            <div class="rounded-xl bg-primary/10 p-4 text-center ring ring-primary/20">
              <UIcon
                name="i-lucide-file-code-2"
                class="mx-auto size-7 text-primary"
              />
              <p class="mt-3 text-sm font-semibold text-highlighted">
                .FIT file
              </p>
              <p class="mt-1 text-xs text-muted">
                Created locally
              </p>
            </div>

            <UIcon
              name="i-lucide-arrow-right"
              aria-hidden="true"
              class="mx-auto size-5 rotate-90 text-dimmed sm:rotate-0"
            />

            <div class="rounded-xl bg-default p-4 text-center ring ring-default">
              <UIcon
                name="i-lucide-cloud-upload"
                class="mx-auto size-7 text-secondary"
              />
              <p class="mt-3 text-sm font-semibold text-highlighted">
                Garmin Connect
              </p>
              <p class="mt-1 text-xs text-muted">
                You choose when
              </p>
            </div>
          </div>

          <div class="flex items-center justify-center gap-2 border-t border-muted bg-muted/60 px-4 py-3 text-xs font-medium text-toned">
            <UIcon
              name="i-lucide-circle-check"
              class="size-4 text-success"
            />
            No upload. No sign-in. No data relay.
          </div>
        </div>
      </div>
    </UPageHero>

    <UPageSection
      headline="Why Weight 2 FIT"
      title="Keep control of your health data"
      description="Move measurements into Garmin Connect without giving another service access to your account or your data."
      :features="benefits"
      class="bg-elevated/40"
    />

    <UPageSection
      id="how-it-works"
      headline="How it works"
      title="From scale to Garmin Connect in three steps"
      description="Use the measurements you already have. Weight is the only required field; all other body composition values are optional."
    >
      <UPageGrid>
        <UPageCard
          v-for="(step, index) in workflowSteps"
          :key="step.title"
          as="article"
          variant="subtle"
          :description="step.description"
          data-testid="workflow-step"
        >
          <template #leading>
            <div class="flex w-full items-center justify-between">
              <span class="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-inverted">
                {{ index + 1 }}
              </span>
              <UIcon
                :name="step.icon"
                class="size-6 text-primary"
              />
            </div>
          </template>

          <template #title>
            <h3>{{ step.title }}</h3>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection
      headline="Explore the toolkit"
      title="Create, inspect, and understand FIT files"
      description="Start with the generator, or use the supporting tools to inspect files and learn about their fields."
      class="bg-elevated/40"
    >
      <UPageGrid>
        <UPageCard
          v-for="tool in tools"
          :key="tool.title"
          :to="tool.to"
          :icon="tool.icon"
          :description="tool.description"
          :highlight="tool.highlight"
          :variant="tool.highlight ? 'subtle' : 'outline'"
          data-testid="tool-card"
        >
          <template #title>
            <h3>{{ tool.title }}</h3>
          </template>

          <template #footer>
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Open {{ tool.title }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4"
              />
            </span>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <UPageSection>
      <UPageCTA
        title="Your health data stays yours."
        description="Create a standards-compatible FIT file without sharing credentials or sending measurements to a server."
        variant="subtle"
        :links="[{
          label: 'Create your FIT file',
          to: '/weight',
          trailingIcon: 'i-lucide-arrow-right'
        }, {
          label: 'View source on GitHub',
          to: 'https://github.com/marcelorodrigo/weight2fit',
          target: '_blank',
          icon: 'i-simple-icons-github',
          color: 'neutral',
          variant: 'ghost'
        }]"
      />
    </UPageSection>
  </div>
</template>
