/* ============================================================
   Google reviews shown on the landing page.
   Rating pulled from the live Google listing (4.9) on 2026-06-12.

   TO ADD REVIEWS: copy a review from Google Maps and add an
   entry below, the carousel updates automatically. For fully
   automatic syncing, wire the Google Places API (needs an API
   key), see README.md.
   ============================================================ */
window.BH_REVIEWS = {
  rating: 4.9,
  source: 'Google',
  listingUrl: 'https://goo.gl/maps/8pzTGUEau1jUC3kdA',
  items: [
    {
      stars: 5,
      text: "I couldn't have asked for a better experience. From hospitality to performance... they were excellent. The facility is beautiful and the staff goes above and beyond.",
      name: 'A.L.',
      note: 'Patient review, published with permission'
    }
  ]
};
