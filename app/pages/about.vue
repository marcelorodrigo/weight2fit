<script setup lang="ts">
usePageSeo({
  title: 'About Weight 2 FIT - Privacy-First Fitness Data Tool',
  description: 'Learn how Weight 2 FIT helps you import body composition data to Garmin Connect securely. No servers, no account compromise—100% client-side FIT file generation.',
  ogDescription: 'A privacy-first tool to generate Garmin FIT files from body composition measurements. Your data never leaves your device. Free and open source.'
})

useSchemaOrg([
  defineWebPage({
    name: 'About Weight 2 FIT',
    description: 'Learn how Weight 2 FIT helps you import body composition data to Garmin Connect securely.'
  })
])
</script>

<template>
  <div class="flex flex-col items-center">
    <UPageHero
      title="About Weight 2 FIT"
      description="A privacy-first tool to import body composition measurements from any source into Garmin Connect, without compromising your account security or sharing data with third-party servers."
      class="w-full"
    />

    <UPageSection class="max-w-3xl space-y-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            The Problem
          </h2>
        </template>
        <p class="text-sm leading-relaxed">
          Most third-party sync tools for body scales and Garmin Connect either require you to disable two-factor authentication or relay your health data through their own servers. Garmin Connect in other hand allows you to import FIT files that might contain body weight composition information into your platform.
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            The Solution
          </h2>
        </template>
        <p class="text-sm leading-relaxed">
          Weight2Fit generates a standard Garmin FIT weight-scale file <strong>directly in your browser</strong>. Your data never leaves your device, and you maintain complete control over your privacy and security.
        </p>
        <p class="text-sm leading-relaxed mt-3">
          You just need to manually type in your measurements, download the file, and import it into Garmin Connect. That's a small price for security and privacy.
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            How It Works
          </h2>
        </template>
        <div class="space-y-3 text-sm">
          <div>
            <p class="font-semibold leading-relaxed">
              1. Enter your data
            </p>
            <p class="leading-relaxed">
              Body composition measurements from your Renpho scale. Weight is required; body fat %, bone mass, muscle mass, body water %, visceral fat rating, and metabolic age are optional.
            </p>
          </div>
          <div>
            <p class="font-semibold leading-relaxed">
              2. Generate & download
            </p>
            <p class="leading-relaxed">
              The app encodes your data into a standard Garmin FIT weight-scale file using the official Garmin JavaScript FIT SDK, running entirely in your browser.
            </p>
          </div>
          <div>
            <p class="font-semibold leading-relaxed">
              3. Import into Garmin Connect
            </p>
            <p class="leading-relaxed">
              Go to <ULink
                to="https://connect.garmin.com"
                target="_blank"
              >connect.garmin.com</ULink>, navigate to <strong>Health Stats → Body Composition</strong>, and use the import button to upload the <code class="bg-gray-100 px-1 rounded">.fit</code> file.
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Why This Approach?
          </h2>
        </template>
        <div class="space-y-2 text-sm">
          <p class="leading-relaxed">
            <strong>Your data stays on your device</strong> — No third-party servers, no data relay
          </p>
          <p class="leading-relaxed">
            <strong>100% client-side</strong> — Powered by the official Garmin FIT SDK
          </p>
          <p class="leading-relaxed">
            <strong>Standard format</strong> — Creates legitimate Garmin FIT files compatible with all Garmin services
          </p>
          <p class="leading-relaxed">
            <strong>No account compromise</strong> — You control when and what gets imported
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Disclaimer
          </h2>
        </template>
        <div class="space-y-3 text-sm">
          <p class="leading-relaxed">
            Weight 2 FIT is an <strong>independent, open-source project</strong>. It is not affiliated with, endorsed by, or connected to Garmin Ltd. or any other fitness device manufacturer.
          </p>
          <p class="leading-relaxed">
            "Garmin" and related trademarks are the property of Garmin Ltd. This tool generates standard FIT format files that can be imported into compatible devices and applications.
          </p>
          <p class="leading-relaxed">
            The FIT SDK library used by this tool is provided by Garmin Ltd. under its own license.
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Open Source
          </h2>
        </template>
        <p class="text-sm leading-relaxed">
          Weight 2 FIT is free and open source. You can view the code, report issues, and contribute on
          <UButton
            to="https://github.com/marcelorodrigo/weight2fit"
            target="_blank"
            variant="link"
            color="primary"
            class="p-0 h-auto"
          >
            GitHub
          </UButton>.
        </p>
      </UCard>
    </UPageSection>
  </div>
</template>
