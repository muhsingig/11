# Avelon Drive

A premium car-rental landing page modelled on the "Avelon Drive" design from motionsites.ai.
Plain HTML/CSS/JS, with GSAP ScrollTrigger and Lenis loaded from a CDN. There's no build step.

## Run it

```powershell
python -m http.server 5260
```

Then open http://localhost:5260.

## What's where

- `index.html`: all the sections (hero → card fold, collection → fleet showcase, experience, night band, reserve form, footer)
- `css/style.css`: tokens at the top, plus the phone layout under `@media (max-width: 900px)`
- `js/fleet.js`: **edit this to change the cars**: name, blurb, price, specs and image
- `js/main.js`: scroll timelines, carousel, specs drawer and the reserve form
- `assets/cars/`: transparent side-view cutouts, all facing left
- `source-photos/`: original Wikimedia Commons photos, kept so the cutouts can be redone

## Notes

- The reserve form has no backend. It validates the fields and shows a confirmation message only.
- The car photos are from Wikimedia Commons: Vauxford (CC BY-SA 4.0) and Harvey Bold (CC0). Keep the credit line in the footer.
- To add a car, cut it out with a transparent background, face it left, put it in `assets/cars/`, then add an entry to `js/fleet.js`.
