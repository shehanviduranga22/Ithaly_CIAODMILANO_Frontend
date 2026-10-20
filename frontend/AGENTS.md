<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Storefront state is managed in the shared root CommerceProvider so cart and wishlist interactions remain consistent across all routes.
- Catalog content and image references live in src/lib/catalog.ts to keep product presentation consistent across shopping pages.
- Wishlist filtering and sorting reuse CollectionGrid so saved pieces follow the same controls as category pages.
- Category campaign headers use the shared EditorialSlideshow so motion, controls, and responsive behavior stay consistent.
- Collection fitting rooms are enabled through the shared CollectionGrid option so product-card behavior remains consistent on selected routes.
- Desktop and mobile category navigation are configured through the shared mega-navigation data in the storefront header so labels, destinations, and campaign features stay aligned.
- Mega-menu subcategory links use validated category search parameters and the shared collection-products anchor so direct links open filtered grids; house links target section anchors.
