# Design System Document: The Ethereal Professional

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Sanctuary"**

This design system moves beyond the sterile, "bootstrap" look of modern SaaS. It treats the authentication experience not as a gate, but as a prestigious entry hall. By blending the precision of **Manrope** headlines with a tonal-first depth strategy, we create an environment that feels secure, authoritative, and impossibly smooth. 

We break the "template" look by eschewing lines in favor of **Tonal Layering**. The layout should feel like physical sheets of vellum stacked atop one another—intentional, weighted, and serene. We favor breathing room (generous whitespace) over density to instill a sense of calm and trust during the high-stakes moment of user authentication.

---

## 2. Colors & Surface Architecture

The palette is anchored in deep, authoritative blues (`primary: #000b60`) and intellectual purples (`secondary: #6f48b2`). 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   **Action:** Use `surface_container_low` for the main page background and `surface_container_lowest` (pure white) for the primary card interaction. The contrast is felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
1.  **Base Layer:** `background` (#fbf8ff)
2.  **Sectioning:** `surface_container` (#efecf5)
3.  **Interactive Cards:** `surface_container_lowest` (#ffffff)
4.  **Floating Elements:** Use `surface_bright` with a 60% opacity and a `24px` backdrop blur to create a "frosted glass" effect for modals or dropdowns.

### The "Glass & Gradient" Rule
Standard flat buttons are insufficient for a premium feel. 
*   **Main CTAs:** Use a subtle linear gradient from `primary` (#000b60) to `primary_container` (#142283) at a 135-degree angle. This adds "soul" and a slight 3D curvature to the button surface.
*   **Secondary Elements:** Use `secondary_fixed_dim` with a 40% opacity blur for decorative background "blobs" to soften the professional edge with a touch of modern warmth.

---

## 3. Typography: The Editorial Voice

We utilize a dual-sans-serif approach to balance character with utility.

*   **The Authority (Manrope):** Used for `display` and `headline` tiers. Manrope’s geometric yet warm structure conveys a "modern institution" feel. Use `headline-lg` for login titles to command the space.
*   **The Utility (Inter):** Used for `title`, `body`, and `label` tiers. Inter is the gold standard for readability. At `body-md` (0.875rem), it ensures that legal disclaimers and input labels are crystal clear.
*   **Intentional Scale:** Create high contrast by pairing a `display-sm` (2.25rem) headline with a `label-md` (0.75rem) uppercase subtitle. This "Editorial" spacing immediately separates the experience from generic templates.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved via "stacking" tokens. Place a `surface_container_lowest` card on a `surface_container_low` background. This creates a natural "lift" that mimics paper on a desk, requiring no aggressive shadows.

### Ambient Shadows
When a floating effect is required (e.g., a focused input or a primary card):
*   **Shadow Value:** `0px 12px 32px -4px`
*   **Shadow Color:** Use `on_surface` (#1b1b21) at **6% opacity**. 
*   **The Tint:** Never use pure black shadows. The 6% opacity allows the underlying soft purple (`surface`) to bleed through, making the shadow feel like ambient light, not digital ink.

### The "Ghost Border" Fallback
If a border is required for accessibility in input fields, use the "Ghost Border":
*   **Token:** `outline_variant` at **20% opacity**. It should be a suggestion of a container, not a cage.

---

## 5. Components

### Input Fields (The Core of Auth)
*   **Unfocused:** Background `surface_container_highest`, no border, `DEFAULT` (0.5rem) corner radius.
*   **Focused:** Background `surface_container_lowest`, 1px "Ghost Border" using `surface_tint`, and a soft 4px spread ambient shadow.
*   **Label:** Use `label-md` in `on_surface_variant`. Move to `title-sm` when floated.

### Buttons
*   **Primary:** Gradient (Primary to Primary Container), `on_primary` text, `md` (0.75rem) corner radius. High-tracking (0.05em) on text for a premium feel.
*   **Secondary:** `surface_container_high` background with `on_secondary_container` text. No border.

### Cards & Lists
*   **The Divider Rule:** Forbid the use of divider lines. Separate list items using `8px` of vertical white space or by alternating background tones between `surface_container_low` and `surface_container`.

### Progressive Disclosure (Additional Component)
*   **Micro-interaction:** For "Forgot Password" or "Social Login" expansions, use a height-transitioning container with a `surface_bright` glassmorphism effect to keep the user grounded in the main auth flow.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `xl` (1.5rem) or `lg` (1rem) corner radius for the main authentication card to make it feel approachable.
*   **Do** use `tertiary_container` for "Success" or "Info" chips to keep the color story within the cool blue/purple family.
*   **Do** prioritize `surface_container_low` for the page background to reduce eye strain compared to a pure #ffffff background.

### Don't
*   **Don't** use 100% black (#000000) for text. Always use `on_surface` (#1b1b21) to maintain the "Architectural Sanctuary" softness.
*   **Don't** use standard "Error Red" (#ff0000). Use the designated `error` (#ba1a1a) token, which is tuned to vibrate less against the deep blue palette.
*   **Don't** stack more than three levels of depth. (Background > Container > Card is the limit).