# Debugging Shop Search Params

## Potential Issues
1. **API Parameter Mismatch**: The `/api/user/product` endpoint might be expecting different parameter names than what's being sent by `ShopPage.tsx`.
2. **State Sync Error**: The `initialSearch` value might not be triggering the appropriate state updates in `ShopPage.tsx`.
3. **URL Overwriting**: Navigation within the Shop page (like clicking categories) might be stripping the `search` param from the URL accidentally.
4. **Data Mapping**: The frontend might be receiving filtered data but misinterpreting it during the `enhanced` product mapping.

## Plan
1. **Inspect API Implementation**: Re-verify `src/app/api/user/product/route.ts` to confirm it handles `search` correctly.
2. **Inspect Shop Page Logic**: check `src/components/ShopPage.tsx` for how `initialSearch` is used.
3. **Trace Navigation**: Check `NavBar.tsx` to see exactly how it constructs the search URL.
4. **Fix**: Ensure `search` is persisted during category filtering and correctly handled in the product fetch.
5. **Verify**: Use the browser tool to confirm that `?search=xxx` results in filtered products.
