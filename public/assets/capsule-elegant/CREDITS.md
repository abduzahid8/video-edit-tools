# Elegant capsule revision

Original Pini Parma catalogue photography; all people and clothing are real photographs. Exact product pages and image URLs are recorded in sources.json. No generated models, garment replacement or simulated try-ons.

Selected wardrobe: off-white turtleneck, ivory shirt, grey checked blazer, navy velvet blazer, light tailored trousers and dark trousers. Three style studies use the original photographed combinations; no total price or discount is asserted.

- cream-*.jpg, grey-*.jpg, navy-*.jpg, shirt-*.jpg: official Pini Parma product photographs downloaded at up to 1600px wide.
- dark-trousers.jpg: crop from navy-2.jpg.
- light-trousers.jpg and loafers.jpg: previously downloaded official Pini Parma photographs; original sources listed in ../smart-casual-shopping/sources.json and CREDITS.md.
- *-cut.png: deterministic OpenCV masks with reviewed manual silhouette guides. Original RGB pixels retained. scripts/prepare-capsule-elegant.py reproduces preparation.
- paper.jpg: existing deterministic project texture.
- paper-motion.wav: original deterministic non-musical Foley, retimed for 33 seconds by scripts/capsule-elegant-sound.py.
- App scene: supplied assets/aiwardrobe/demo-full.mp4, category → create → result.

Photographic rights remain with their owners; no open licence or commercial relationship is asserted.

## Stronger opening
Three distinct real models: the Pini Parma grey and navy looks above, plus the previously sourced Suitsupply checked blazer/tie photograph (../smart-casual-shopping/suit-pattern-cut.png; exact source in that folder's sources.json). hook-*.png are cropped/resized cutouts; hook-*.jpg flatten the same photographed people onto white editorial mats. No faces or clothing are generated. Preparation: scripts/prepare-capsule-opening.py.

opening-motion.wav replaces only the first 2.8 seconds of Foley with three shutter taps, stereo paper swipes and a soft landing. The approved audio after 2.8 seconds is preserved. scripts/capsule-opening-sound.py reproduces it.
