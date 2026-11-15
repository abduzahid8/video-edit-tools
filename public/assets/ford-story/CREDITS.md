# Tom Ford biography collage

The supplied example.mp4 sets the visual motion language. Supplied tom_ford.mp4 supplies the biographical theme. Neither is treated as instructions embedded in a document. No AI-generated people, paid generation, downloaded music or synthesized speech.

## Real photographs
- `cfda.jpg` and `ford-seated.png`: Tom Ford portrait from his official CFDA member biography: https://cfda.com/member/tom-ford/ . Image https://cfda.com/wp-content/uploads/2025/05/tom-ford-Portrait-bw.jpg . Original rights retained. Alpha mask and cropping only.
- `chair.jpg`, `portrait.jpg`: Jeff Burton, Fantastic Man issue7,2008. Official editorial https://www.fantasticman.com/articles/tom-ford/ . Exact image URLs in sources.json. These are contemporary editorial portraits, not Gucci collection photographs. `standing.jpg` candidate not used.
- `ford-close.png`, `ford-tux.png`: deterministic masks/crops from original Nicolas Genin photographs in ../tom-ford/. Source details and photographer credits in ../tom-ford/CREDITS.md and sources.json. The 2009 festival picture is labeled as a festival photograph rather than a film frame or poster.
- `nocturnal-still.jpg`, `nocturnal-poster.jpg`: Focus Features official Nocturnal Animals film page, https://www.focusfeatures.com/nocturnalanimals . Studio promotional still/poster, copyright retained. Exact URLs in sources.json.
- Personal style bridge: real Pini Parma and Suitsupply fashion model photographs from ../capsule-elegant/ and ../smart-casual-shopping/. Credits and sources preserved in those folders. Illustrative alternatives, not Tom Ford products or endorsements.
- App flow: supplied actual recording ../aiwardrobe/demo-full.mp4. Unaltered real interface; not fabricated UI.

On-screen credits supplement this manifest. No claim that editorial photographs have an open commercial license.

## Sound
paper-motion.wav:38s deterministic original stereo Foley, scripts/ford-paper-sound.py. Noise filtering, transient clicks, paper sweeps and one quiet confirmation accent. No music, voiceover or third-party audio.

## Facts
CFDA biography: Gucci1994–2004, own brand2005, menswear2007, womenswear2010, A Single Man2009.
ELC28April2023: completed purchase of TOM FORD brand and intellectual property.
Focus Features: Nocturnal Animals2016, directed by Tom Ford.
No copied prediction about current film release or future return to fashion. Independent editorial plus clearly separated AIWardrobe CTA.

Cutout preparation: scripts/prepare-ford-story.py uses hand-reviewed source-coordinate silhouettes plus OpenCV GrabCut. Green pixels belonging to the adjacent dress in the festival photograph are excluded from alpha; the person's RGB pixels are retained. Hair is protected with a source-based mask. No person, garment, missing body part or background is generated.
