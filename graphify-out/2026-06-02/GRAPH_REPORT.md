# Graph Report - Priyanka Fashionvilla  (2026-06-02)

## Corpus Check
- 102 files · ~66,209 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 433 nodes · 688 edges · 44 communities (30 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fcb9d531`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `$()` - 30 edges
2. `createClient()` - 24 edges
3. `createClient()` - 23 edges
4. `cn()` - 19 edges
5. `a` - 18 edges
6. `compilerOptions` - 16 edges
7. `get()` - 15 edges
8. `v` - 14 edges
9. `z()` - 14 edges
10. `useCartStore` - 13 edges

## Surprising Connections (you probably didn't know these)
- `HeroAnimation()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/HeroAnimation.tsx → src/lib/utils.ts
- `ProductCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/ProductCard.tsx → src/lib/utils.ts
- `CheckoutPage()` --calls--> `useCartStore`  [EXTRACTED]
  src/app/checkout/page.tsx → src/store/cart.ts
- `Home()` --calls--> `getProducts()`  [EXTRACTED]
  src/app/page.tsx → src/lib/db.ts
- `generateMetadata()` --calls--> `getProduct()`  [INFERRED]
  src/app/product/[id]/page.tsx → src/lib/db.ts

## Import Cycles
- None detected.

## Communities (44 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (22): getProductReviews(), submitReview(), AdminExportAndInsightsProps, CartCount(), CartDrawer(), CheckoutPage(), Hero(), Header() (+14 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (28): Home(), HeroAnimation(), HeroAnimationProps, ModelDisplayProps, ProductCarouselProps, generateMetadata(), ProductPage(), products (+20 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (7): grantAdminRights(), createCoupon(), deleteCoupon(), toggleCoupon(), AnalyticsProps, OrderData, createClient()

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (25): dependencies, clsx, crypto-js, @ducanh2912/next-pwa, framer-motion, lucide-react, next, otpauth (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.23
Nodes (5): addAddress(), deleteAddress(), updateAddress(), updateProfile(), StyleQuizProps

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (18): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (5): addProduct(), deleteProduct(), updateProduct(), uploadProductImage(), initialState

### Community 8 - "Community 8"
Cohesion: 0.32
Nodes (3): createReturn(), updateReturnStatus(), STATUS_STEPS

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (11): deleteOrder(), updateOrderStatus(), updateTrackingNumber(), emailTemplates, sendEmail(), OrderNotification, parseStatusCommand(), sendOrderNotification() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (3): inter, metadata, playfair

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (5): a, F, get(), h(), z()

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (4): name, organization_id, organization_slug, ref

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 42 - "Community 42"
Cohesion: 0.09
Nodes (19): $(), b(), deleteCacheAndMetadata(), et, G, i, j(), k() (+11 more)

## Knowledge Gaps
- **120 isolated node(s):** `eslintConfig`, `nextConfig`, `withPWA`, `nextConfig`, `name` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sendOrderNotification()` connect `Community 10` to `Community 42`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 2` to `Community 0`, `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 10`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `$()` connect `Community 42` to `Community 12`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `withPWA` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08295625942684766 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06938020351526364 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._