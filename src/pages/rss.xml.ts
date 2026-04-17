import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');

  const sorted = articles.sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  return rss({
    title: 'Stand Against Trump',
    description: 'Documented arguments against supporting Trump — every claim sourced.',
    site: context.site!,
    items: sorted.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.summary,
      link: `/${article.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
