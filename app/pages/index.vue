<template>
  <div>
    <UPageHero
      description="Handy utilities for Garmin device data. Generate, convert, and explore FIT files from your Garmin ecosystem."
      :links="[{
        label: 'Try Weight Tool',
        to: '/weight',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'View on GitHub',
        to: 'https://github.com/marcelorodrigo/garmin-tools',
        target: '_blank',
        icon: 'i-simple-icons-github',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    >
      <template #title>
        <span class="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
          Garmin Tools
        </span>
      </template>
    </UPageHero>

    <UPageSection
      id="tools"
      title="Tools"
      description="Start with the Weight Scale FIT Generator — more utilities are in development."
      :features="[{
        icon: 'i-lucide-scale',
        title: 'Weight Scale FIT Generator',
        description: 'Generate Weight Scale FIT files from body composition data. Fill in your metrics and download a ready-to-import .fit file for Garmin Connect.'
      }, {
        icon: 'i-lucide-dumbbell',
        title: 'Activity Tools',
        description: 'Analyze and convert activity FIT files. View detailed metrics from your workouts. (Coming soon)'
      }, {
        icon: 'i-lucide-trending-up',
        title: 'Body Composition Trends',
        description: 'Track and visualize your body composition data over time. Spot trends and changes in your metrics. (Coming soon)'
      }, {
        icon: 'i-lucide-puzzle',
        title: 'More to come',
        description: 'Additional tools for Garmin device data are in development. Suggestions welcome on GitHub!'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to get started?"
        description="Generate a Weight Scale FIT file and import your body composition data into Garmin Connect."
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
