/** Human-readable taxonomy label supporting legacy-only `category` rows. */
export function categoryLabel(product) {
  return product?.categoryName || product?.category || "Uncategorised";
}
