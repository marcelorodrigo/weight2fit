<template>
  <div>
    <UPageHero
      title="About Weight 2 FIT"
      description="A lightweight tool for generating FIT format files from body composition data."
    />

    <UPageSection class="max-w-3xl space-y-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            What is Weight 2 FIT?
          </h2>
        </template>
        <p class="text-sm leading-relaxed">
          Weight 2 FIT is a tool that lets you generate FIT format files from body composition data. The FIT file format is a standard used by fitness devices and apps to store workout and body metrics data. This tool allows you to create compatible FIT files so you can import body composition measurements into any device or application that supports the FIT format.
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Why FIT Format?
          </h2>
        </template>
        <p class="text-sm leading-relaxed">
          The FIT (Flexible and Interoperable Data Transfer) format is an open standard that allows fitness devices from different manufacturers to share data. By generating FIT files with your body composition metrics, you gain the flexibility to use them across multiple devices and platforms without being locked into a single ecosystem.
        </p>
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
            The FIT SDK library used by this tool is provided by Garmin Ltd. under its own license. For more details, see the project repository on GitHub.
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
