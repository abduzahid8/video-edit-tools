# Layering Editorial — Credits & Asset Notes

A 30s menswear layering study in the example3 reference style (white field,
cutout figures, echo text, wipe pill, cursor captions). All people shown are
real photography; no AI-generated faces or bodies were used.

## Photography (Pexels, free license)

Downloaded with `scripts/fetch-pexels.py` from the Pexels CDN; originals in
`raw/`, figure cutouts in `cutouts/` (made with `scripts/cutout.py`).

| File | Pexels photo id | Photographer | Use in edit |
| --- | --- | --- | --- |
| `raw/hero.jpg` → `cutouts/hero.png` | 6211656 | (see Pexels page) | layered hero figure — cover, weight "Thick", build-up overcoat, V-shape, outro |
| `raw/knit.jpg` → `cutouts/knit.png` | 20775155 | (see Pexels page) | knit mid-layer figure — build-up, outro |
| `raw/thin.jpg` | 8217507 | (see Pexels page) | white-tee "Thin" state of the weight rule (rectangular photo treatment) |
| `raw/puffer.jpg` | 31456029 | (see Pexels page) | puffer jacket "Not So Much…" example (rectangular photo treatment) |

`raw/knit-alt.jpg` (34884827) was cut but not used in the final edit.

Pexels license: free to use, attribution appreciated; photographer names are
on each photo page: https://www.pexels.com/photo/<id>

## Type

Georgia / Times New Roman / Courier New — macOS system fonts, no font files
redistributed with this project.

## Music

`layering-score.wav` — deterministic numpy/scipy synthesis in
`scripts/layering-score.py` (felt piano, thin pad, print ticks, room tone).
No downloaded music or samples.

## Changes made to photos

- Backgrounds flood-fill removed (`scripts/cutout.py`), figures cropped to
  alpha bbox; knit figure: shadow-streak columns cropped; thin figure: white
  wall tint neutralised to pure white.
- CSS xerox grade applied at render time (slight desaturation, contrast,
  brightness) to match the reference's bleached photocopy look.
