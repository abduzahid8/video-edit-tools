# Improved portrait selection

Real photographs; no AI-generated people, garments or restored body parts.

Used:
- `ford-airmail.jpg`: Air Mail, Ford Tough, 13 May2023. Source article https://airmail.news/issues/2023-5-13/ford-tough . Original studio portrait on white. Source URL in sources.json. `ford-airmail-cut.png` removes only border-connected white pixels, preserving original RGB, using scripts/prepare-ford-models.py. This replaces the previous rough CFDA and occluded red-carpet silhouettes.
- `ford-vf.jpg`: Justin Bishop / Vanity Fair, Portraits from the2016Toronto International Film Festival. https://www.vanityfair.com/hollywood/photos/2016/09/toronto-international-film-festival-portraits . Full head, seated figure and tailored suit; photograph stays inside a clean mat.
- `ford-bof.jpg`: The Business of Fashion, The Business of Being Tom Ford: A Return to Womenswear and The Future. https://www.businessoffashion.com/articles/news-analysis/the-business-of-being-tom-ford-part-ii/ . Original photograph, reframed with face retained. Exact URL in sources.json.
- Final three looks use existing full source photographs: capsule-elegant/grey-3.jpg, capsule-elegant/navy-0.jpg and smart-casual-shopping/suit-pattern.jpg. Their existing source manifests remain applicable. Photographic mats preserve real garment edges, collars, faces and fabric rather than extracting small body crops.

Candidate official Tom Ford campaign images were downloaded for visual selection but are not used. No claims about the models' identities or endorsements. No open commercial license is asserted for editorial/catalogue photographs. Original rights retained; on-screen credits included.

The screenplay,38-second timeline, Foley and real AIWardrobe category/create/result flow are preserved.
