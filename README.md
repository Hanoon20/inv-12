# Rizan & Hana · Nikah & Walima Invitation

A cinematic digital wedding invitation in deep wine, blush and gold. The design is based on the "Velvet & Vine" reference.

## Sections
1. **Envelope intro**: tap the wax seal to open the invitation in 3D.
2. **Hero**: Bismillah, the bride and groom names, the date and a 3D arch photo that tilts with the mouse.
3. **Quran verse**: Ar-Rum 30:21. The words light up one by one as you scroll.
4. **The couple and parents**: the bride and groom cards swing in from 3D space.
5. **Countdown**: days, hours, minutes and seconds, updating live.
6. **Our story**: a pinned horizontal row of 3D "chapter" cards (stacked on mobile).
7. **Events**: Mehndi, Nikah and Walima cards that tilt in 3D on hover.
8. **Programme timeline**: the line draws itself as you scroll.
9. **Venue**: an arch-shaped image opens to full screen, with directions and a map.
10. **Closing dua**, plus Add to Calendar (.ics), Share on WhatsApp and Call buttons.

Throughout the page: Lenis smooth scrolling (phones keep their native touch scrolling), GSAP ScrollTrigger parallax, falling rose petals, a film-grain overlay and a scroll progress bar. If the device has "reduce motion" turned on, the animations are switched off.

## Edit your details
Everything is in **`assets/js/config.js`**: names, parents, date, venue, events, programme, story and phone number. Change it and refresh the page.

## Replace the photos
The photos are in `assets/img/`. Keep the same file names, or change the paths in `config.js`.

| File | Used in |
|---|---|
| `hero.jpg` | Hero arch (portrait 3:4) |
| `couple.jpg` | Our Story (portrait 4:5) |
| `reception.jpg` | Our Story small photo + Walima card |
| `rings.jpg` | Nikah card |
| `mehndi.jpg` | Mehndi card |
| `venue.jpg` | Venue reveal (landscape 16:9) |

## Run locally
There is no build step. Open the folder with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Upload the folder to GitHub Pages, Netlify or Vercel as a static site. GSAP and Lenis are already included in `assets/js/vendor/`, so the page doesn't load them from a CDN. Only the Google Fonts and the map embed need internet.
