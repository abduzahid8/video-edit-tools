# Capsule Editorial — photography and audio

All models are real catalogue photography from Quince. No generated faces, bodies or simulated clothing. Original 1200/1400px-wide images were downloaded from the brand's public image CDN; exact image URLs are in sources.json. Candidate images are retained, not all appear in the composition.

Catalogue sources:
- Cream knit: https://www.quince.com/men/australian-merino-wool-cable-crewneck-sweater?color=heather-bone
- Navy knit: https://www.quince.com/men/mens-organic-cotton-quarter-zip-sweater?color=heather-navy
- Blue Oxford: https://www.quince.com/men/100-organic-cotton-oxford-shirt?color=pale-blue
- Green jacket: https://www.quince.com/men/featherless-quilted-jacket?color=verdant-pine
- Trousers and jeans catalogue: https://www.quince.com/shop/men/pants/straight

Original photograph rights remain with their owners; no open licence is claimed. The video is a fashion editorial concept, not a Quince promotion or a claim of a commercial relationship. No prices, discounts or product availability are asserted.

Full-body cutouts are deterministic OpenCV masks with manually reviewed silhouette guides. The original RGB photograph is preserved; no generative fill. Preparation is reproducible with scripts/prepare-capsule-assets.py. paper.jpg is a neutralised copy of the project's deterministic generated paper texture.

The AIWardrobe segment uses the supplied assets/aiwardrobe/demo-full.mp4 recording. It shows a separate category/create/result demonstration, not generated versions of the catalogue clothes. Screen content is unmodified.

paper-motion.wav is original deterministic Foley, generated locally by scripts/capsule-sound.py: paper swipes, soft taps and low impacts. No downloaded song, music bed or voiceover.

Reference motion: user-supplied example2.mp4. Topic: user-supplied theme_discount.mp4. Reference photographs, presenter, speech, brands and exact claims were not copied into the new video.
