# Graph Report - Priyanka Fashionvilla  (2026-06-30)

## Corpus Check
- 107 files · ~112,788 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 459 nodes · 797 edges · 43 communities (28 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bcc5843d`
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
- [[_COMMUNITY_Community 18|Community 18]]
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
1. `createClient()` - 50 edges
2. `$()` - 30 edges
3. `createClient()` - 27 edges
4. `cn()` - 19 edges
5. `a` - 18 edges
6. `compilerOptions` - 16 edges
7. `get()` - 15 edges
8. `Product` - 14 edges
9. `v` - 14 edges
10. `z()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `LoginForm()` --calls--> `createClient()`  [INFERRED]
  src/app/(auth)/login/page.tsx → src/lib/supabase/server.ts
- `WishlistPage()` --calls--> `createClient()`  [INFERRED]
  src/app/account/wishlist/page.tsx → src/lib/supabase/server.ts
- `CheckoutPage()` --calls--> `createClient()`  [INFERRED]
  src/app/checkout/page.tsx → src/lib/supabase/server.ts
- `HeroAnimation()` --calls--> `cn()`  [EXTRACTED]
  src/components/home/HeroAnimation.tsx → src/lib/utils.ts
- `ProfileDropdown()` --calls--> `createClient()`  [INFERRED]
  src/components/layout/ProfileDropdown.tsx → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (43 total, 15 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (24): getProductReviews(), submitReview(), AdminExportAndInsightsProps, CartCount(), CartDrawer(), CheckoutPage(), Hero(), ProductCarousel() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (32): AboutPage(), Home(), HeroAnimation(), HeroAnimationProps, ModelDisplayProps, ProductCarouselProps, generateMetadata(), ProductPage() (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (22): grantAdminRights(), createCoupon(), deleteCoupon(), toggleCoupon(), validateCoupon(), verifyAdmin(), deleteOrder(), updateOrderStatus() (+14 more)

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
Nodes (19): eslintConfig, devDependencies, eslint, eslint-config-next, jimp, tailwindcss, @tailwindcss/postcss, @types/node (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (14): getBgRemovalStats(), addProduct(), deleteProduct(), removeBgForImageUrl(), removeImageBackground(), updateProduct(), uploadProductImage(), uploadProductImageWithBgRemoval() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.57
Nodes (4): createCategory(), deleteCategory(), updateCategory(), verifyAdmin()

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (8): background_color, description, display, icons, name, short_name, start_url, theme_color

### Community 10 - "Community 10"
Cohesion: 0.31
Nodes (4): createReturn(), updateReturnStatus(), verifyAdmin(), STATUS_STEPS

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (3): inter, metadata, playfair

### Community 12 - "Community 12"
Cohesion: 0.09
Nodes (4): a, get(), h(), z()

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (4): name, organization_id, organization_slug, ref

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 42 - "Community 42"
Cohesion: 0.09
Nodes (20): $(), b(), deleteCacheAndMetadata(), et, F, G, i, j() (+12 more)

## Knowledge Gaps
- **124 isolated node(s):** `Category`, `Profile`, `Address`, `Order`, `OrderStatus` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `Community 2` to `Community 0`, `Community 1`, `Community 4`, `Community 7`, `Community 8`, `Community 10`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `removeImageBackground()` connect `Community 7` to `Community 42`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `$()` connect `Community 42` to `Community 12`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createClient()` (e.g. with `CheckoutPage()` and `ProfileDropdown()`) actually correct?**
  _`createClient()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Category`, `Profile`, `Address` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08013468013468013 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06636500754147813 - nodes in this community are weakly interconnected._