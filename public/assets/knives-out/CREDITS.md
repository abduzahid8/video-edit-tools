# Knives Out Editorial — Credits & Asset Notes

A film-wardrobe style study. All people shown are real photography; no
AI-generated faces or bodies were used.

## Photography from the supplied reference

The hero stills and every product image in the luxury / "Try" catalogue cards
are deterministic crops from the user-supplied reference video
`theme.mp4` ("How to Dress Like Chris Evans / Knives Out Edition").

- `raw/hero-*.jpg` — outfit stills cropped from the reference video.
- `products/*-lux.png`, `products/*-budget.png` — product cutouts cropped from
  the reference video.
- `products/*-cut.png` — soft white-key extractions of those crops, used on the
  paper background.

These assets are included for this personal style-study edit. They are not
licensed for redistribution or commercial use. The reference video and its
underlying film stills remain the property of their respective rights holders.

## Pexels editorial photography

Used under the [Pexels license](https://www.pexels.com/license/). Photographer
credit is listed for each image; Pexels does not require attribution, but it is
good practice.

| File | Photographer | Pexels page | Use in edit |
| --- | --- | --- | --- |
| `candidates/27175948.jpg` | Ali Ahmed | https://www.pexels.com/photo/27175948/ | Look — "The library, after hours." |
| `candidates/20775155.jpg` | Gursher Gill | https://www.pexels.com/photo/20775155/ | Knit chapter inset — "Cable, in close." |
| `candidates/30007899.jpg` | Emre Simsek | https://www.pexels.com/photo/30007899/ | Coat chapter inset — "Tweed, in winter." |
| `candidates/7918113.jpg` | The Lazy Artist Gallery | https://www.pexels.com/photo/7918113/ | Trousers chapter inset — "Chalk stripe, in detail." |
| `candidates/8159478.jpg` | Nyara Aquino | https://www.pexels.com/photo/8159478/ | Loafers chapter inset — "Brown leather, on rattan." |
| `candidates/8360292.jpg` | Viany J. Jimenez | https://www.pexels.com/photo/8360292/ | Sunglasses chapter inset — "Black acetate, on paper." |
| `candidates/29876569.jpg` | Okiki Onipede | https://www.pexels.com/photo/29876569/ | Outro — "A quiet silhouette." |

**Note:** the Pexels portraits are atmosphere and detail, not photographs of
Chris Evans. The outro portrait in particular is a separate model; its caption
("A quiet silhouette.") is intentionally not an identification. Only the
stills cropped from `theme.mp4` depict the subject of the reference breakdown.

The `candidates/` folder also contains other downloaded Pexels images that were
considered but are not used in the final edit.

## 30s collage cut

`KnivesOutCollage` is the short recut. It reuses the hero stills and every
product cutout above and adds four more Pexels photographs for the off-canvas
and documentary beats:

| File | Photographer | Pexels page | Use in the collage cut |
| --- | --- | --- | --- |
| `candidates/30261019.jpg` | Murat IŞIK | https://www.pexels.com/photo/30261019/ | "The Look" — full-bleed page |
| `candidates/19113849.jpg` | Antonio Bracho | https://www.pexels.com/photo/19113849/ | Coat — full-bleed page |
| `candidates/38545837.jpg` | Veronika Kuracheva | https://www.pexels.com/photo/38545837/ | Knit — "Wool, in winter." inset |
| `candidates/3768904.jpg` | Andrea Piacquadio | https://www.pexels.com/photo/3768904/ | Frames — "Gold wire, green glass." inset |

`products/clean/*.png` are de-fringed copies of the white-key cutouts, produced
deterministically by `scripts/refine-knives-cutouts.py`. The originals are kept
unchanged for the 51s `KnivesOutEditorial` cut.

## Type

- **Didot** — display serif (macOS system font).
- **Georgia** — body serif (macOS system font).
- **Helvetica Neue** — small caps / labels (macOS system font).

No font files are redistributed with this project.

## Music

`knives-score.wav` (51s cut) and `knives-score-30.wav` (30s collage cut) are
original deterministic scores generated for this edit by
`scripts/knives-score.py` and `scripts/knives-score-30.py` (numpy/scipy: felt
piano, modal pad, page-turn brushes). No downloaded or licensed music is used.

## Texture

`paper-grain.jpg` is generated deterministically by
`scripts/knives-paper.py`. No third-party texture is used.
