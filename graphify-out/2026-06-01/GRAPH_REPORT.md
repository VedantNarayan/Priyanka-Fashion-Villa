# Graph Report - Priyanka Fashionvilla  (2026-06-01)

## Corpus Check
- 98 files · ~64,844 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 339 nodes · 484 edges · 42 communities (28 shown, 14 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `67437e8c`
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

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 23 edges
2. `createClient()` - 23 edges
3. `cn()` - 19 edges
4. `compilerOptions` - 16 edges
5. `useCartStore` - 13 edges
6. `Product` - 12 edges
7. `useWishlistStore` - 7 edges
8. `products` - 6 edges
9. `scripts` - 5 edges
10. `getProducts()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `HeroAnimation()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/HeroAnimation.tsx → src/lib/utils.ts
- `ProductCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/ProductCard.tsx → src/lib/utils.ts
- `syncToSupabase()` --calls--> `createClient()`  [EXTRACTED]
  src/store/cart.ts → src/lib/supabase/client.ts
- `CheckoutPage()` --calls--> `useCartStore`  [EXTRACTED]
  src/app/checkout/page.tsx → src/store/cart.ts
- `Home()` --calls--> `getProducts()`  [EXTRACTED]
  src/app/page.tsx → src/lib/db.ts

## Import Cycles
- None detected.

## Communities (42 total, 14 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (18): CartCount(), CartDrawer(), CheckoutPage(), Hero(), Header(), HeaderProps, ProfileDropdown(), ProfileDropdownProps (+10 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (28): Home(), HeroAnimation(), HeroAnimationProps, ModelDisplayProps, ProductCarouselProps, generateMetadata(), ProductPage(), products (+20 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (5): grantAdminRights(), AnalyticsProps, OrderData, AdminExportAndInsightsProps, createClient()

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (24): dependencies, clsx, crypto-js, @ducanh2912/next-pwa, framer-motion, lucide-react, next, otpauth (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (10): deleteOrder(), updateOrderStatus(), updateTrackingNumber(), emailTemplates, sendEmail(), OrderNotification, parseStatusCommand(), sendOrderNotification() (+2 more)

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
Cohesion: 0.23
Nodes (5): addAddress(), deleteAddress(), updateAddress(), updateProfile(), StyleQuizProps

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (6): createReturn(), updateReturnStatus(), getProductReviews(), submitReview(), STATUS_STEPS, createClient()

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (3): inter, metadata, playfair

### Community 12 - "Community 12"
Cohesion: 0.43
Nodes (3): createCoupon(), deleteCoupon(), toggleCoupon()

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): graphify-out/graph.json, Graphify Rules, Graphify Workflow

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **116 isolated node(s):** `eslintConfig`, `nextConfig`, `withPWA`, `nextConfig`, `name` (+111 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 2` to `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 10`, `Community 12`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 10` to `Community 0`, `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 12`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 0` to `Community 1`, `Community 10`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `withPWA` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06938020351526364 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._