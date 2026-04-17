# Testimonials

Every file in this folder is rendered under the `testimonials` content collection (Zod-validated in `src/content/config.ts`).

## Rules
1. Launch testimonials are **composite** — drawn from brand-guide copy to represent the kinds of feedback Morgan expects. `isComposite: true` and `consentOnFile: false`.
2. Replace with real reviews as they come in. When you do:
   - Set `isComposite: false`
   - Set `consentOnFile: true` only after the client has explicitly approved the copy and the use of first name + last initial + city.
   - Keep the file number prefix (`NN-slug.mdx`) for stable ordering.
3. Never publish a client's full name, exact address, or identifying details. First name + last initial is the ceiling.
4. Attorneys / partner reviews use the display name "Attorney, [area]" unless the firm has given written permission to name them.
5. Any change here should be reviewed for UPL compliance — quotes describing a notary "explaining" a document must be rewritten to "walking through" or "directing" through.
