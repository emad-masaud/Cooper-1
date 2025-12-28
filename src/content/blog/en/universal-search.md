---
title: 'Universal Search with Pagefind'
description: 'Implementing lightning-fast static search without a backend.'
pubDate: '2025-01-15'
heroImage: '~/assets/blog/search.jpg'
tags: ["search", "tech"]
---

Search usually requires complex infrastructure: ElasticSearch, Algolia, or a dedicated database. 
**Pagefind** changes the paradigm for static sites.

## How It Works

1.  **Build Time**: After Astro builds your site, Pagefind scans the static HTML files.
2.  **Indexing**: It creates a static index of your content.
3.  **Run Time**: The browser downloads tiny chunks of this index as needed.

## The Result

- **Zero API Costs**: It runs entirely on the client.
- **Privacy First**: No user search data is sent to a third party.
- **Bandwidth Efficient**: It only loads the index segments relevant to the query.

Gladtek wraps this powerful engine in a beautiful, accessible Command Palette (`Cmd+K`) interface.




## Further Reading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

