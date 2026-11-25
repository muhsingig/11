# Idlewild

A New York motor club website: 21 cars from 7 marques, delivered to your door within the hour.
Before it was JFK, New York's airport was called Idlewild, so the brand is all about arrival.

Plain HTML/CSS/JS, with GSAP ScrollTrigger and Lenis loaded from a CDN. There's no build step.

## Run it

```powershell
python -m http.server 5260
```

Then open http://localhost:5260.

## What's where

- `index.html`: the sections, in order: hero → origin card, fleet showcase, garage, how it works, night band, membership, reserve, footer
- `css/style.css`: brand tokens at the top (ivory, ink, amber; Instrument Serif and Instrument Sans), plus the phone layout under `@media (max-width: 900px)`
- `js/fleet.js`: **edit this to change the cars and brands**: name, blurb, price, type, specs and photo credit
- `js/main.js`: scroll timelines, fleet carousel with brand tabs, garage filter, specs drawer and the reserve form
- `assets/cars/`: transparent side-view cutouts, all facing left
- `source-photos/`: the original Wikimedia Commons photos, kept so the cutouts can be redone

## Adding a car

1. Cut the car out with a transparent background, make it face left, and save it as `assets/cars/<id>.webp`.
2. Add an entry to `window.FLEET` in `js/fleet.js` with that `id`, its `brand` and its photo `credit`.

The brand tabs, garage grid, reserve dropdown and photo-credit list all build themselves from that file.

## Notes

- The reserve form has no backend. It validates the fields and shows a confirmation message only.
- The car photos come from Wikimedia Commons under CC BY-SA 4.0, CC BY-SA 2.0, CC BY 4.0 or CC0. The footer's "Photo credits" list names each photographer, and it needs to stay on the site.
