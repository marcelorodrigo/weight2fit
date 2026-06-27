export interface PageSeoMeta {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  robots?: string
}

export function usePageSeo(meta: PageSeoMeta) {
  const config = useAppConfig()

  const siteUrl = config.seo.siteUrl
  const canonicalUrl = meta.canonicalUrl || `${siteUrl}${useRoute().path}`

  useSeoMeta({
    title: meta.title,
    description: meta.description,
    ogTitle: meta.ogTitle || meta.title,
    ogDescription: meta.ogDescription || meta.description,
    ogImage: meta.ogImage,
    robots: meta.robots || 'index, follow'
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonicalUrl }
    ]
  })
}
