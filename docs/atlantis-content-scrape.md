# Live site content scrape

Source: https://www.hotelatlantisamsterdam.com/ — captured 2026-07-31.
Working reference for populating the new site's content. English is the source language.

Pages captured: `/`, `/rooms`, `/facilities`, `/faq`, `/contact`, `/explore`, `/offers`.
Not captured: `/photos`, `/privacy-policy`, individual room detail pages.

---

## Identity & contact

- **Name:** Hotel Atlantis Amsterdam
- **Address:** Ceintuurbaan 215-217, 1074 CV Amsterdam, Netherlands
- **Phone:** +31 20 3640034
- **Email:** info@hotelatlantisamsterdam.com
- **Reception:** 24/7
- **Site languages:** English, Nederlands, Deutsch, Français, Italiano, Español
- **Star rating / total room count:** not published anywhere on the site

---

## Rooms (6 types)

No prices published on any room page; rates live only in the booking engine.
All rooms list the same base amenities: flat-screen TV, free Wi-Fi, tea/coffee maker, seating area.

| Room (as displayed) | Guests | m² | Outdoor | Bed | Slug |
|---|---|---|---|---|---|
| Twin Room | 2 | 15 | — | 2 single | `/rooms/twin-room` |
| Twin room with Balcony | 2 | 18 | Balcony | 2 single | `/rooms/deluxe-twin-room` |
| Triple room | 3 | 22 | — | 1 double + 1 single | `/rooms/triple-room` |
| Quadruple room with Balcony | 4 | 26 | Balcony | 2 twin | `/rooms/quadruple-room` |
| Double Room | 2 | 15 | — | 1 double | `/rooms/double-room` |
| Double Room with Balcony | 2 | 18 | Balcony | 1 double | `/rooms/deluxe-double-room` |

The two balcony rooms additionally list a safety deposit box, iron, and wardrobe.

**Naming is inconsistent on the source site** and needs a decision before content entry:
the homepage calls these "Deluxe twin room with balcony" and "Deluxe double room with balcony",
the rooms page drops "Deluxe" from the visible title, but the URL slugs keep it
(`deluxe-twin-room`, `deluxe-double-room`). Capitalisation also varies
("Twin Room" vs "Triple room"). Pick one convention for the new site.

---

## Facilities & services

- **Reception:** 24/7; luggage storage available after check-out; ticket service and concierge (bike tours, museum tickets, canal cruises).
- **Breakfast:** "Royal Breakfast", daily 07:30–10:30, €17.50 pp, 10% off for direct bookers.
- **In room:** smart TV, coffee machine, free Wi-Fi throughout.
- **Lobby:** complimentary drinks and snacks.
- **Parking:** no on-site parking. Discounted Q-Park nearby with reserved spaces, 9 minutes by tram 3.
- **Lift:** listed as out of service (see stale-content note below).

---

## Policies (from /faq)

- **Check-in:** from 15:00, online check-in required. Direct bookers from 14:00.
- **Check-out:** 11:00. Late checkout €50 until 13:00; full day rate after 14:00.
- **Pets:** not allowed.
- **Smoking:** 100% non-smoking, €250 fine.
- **Children:** under 2 stay free. At least one adult (18+) per room.
- **Extra beds / cots:** none available.
- **Payment:** credit card required for non-refundable rates; bank transfer in exceptional cases; **no cash**.
- **Flexible rate:** free cancellation until 23:59 the day before arrival; late cancellation or no-show charged 1 night.
- **Non-refundable rate:** charged 100% at booking, no refund.
- **Accessibility:** the site states there are no facilities for disabled guests.
- **Air conditioning:** not mentioned anywhere. Needs confirming.
- **City tourist tax:** 12.5% of the room rate per night, on top of the rate shown. Confirmed by the hotel, 2026-07-31. Not published on the source site.
- **Reception:** staffed 24 hours. Confirmed by the hotel, 2026-07-31.

---

## Offers

Only one named offer: **Book Direct Discount**. 10% off room rates year-round, 10% off breakfast,
early check-in from 14:00, late checkout until 12:00, optional add-ons (breakfast, bottle of wine,
birthday package), flexible payment, direct contact with the team. Conditional on booking via the
hotel's own site.

---

## Location & surroundings (from /explore)

Just outside the canal ring, in **De Pijp**.

- **Albert Cuypmarkt** — walking distance, daily.
- **Museumplein** — Rijksmuseum (5 min by tram), Van Gogh, Stedelijk, Moco, Concertgebouw.
- **Dam Square** — ~15 min; Royal Palace, Nieuwe Kerk, Madame Tussauds, De Bijenkorf, National Monument.
- **Amsterdam RAI** and **Zuidas** — 8–10 min by car, bike or tram.
- Also promoted: Jordaan, NDSM-wharf, canal boat tours.

**From Schiphol:** train to Amsterdam Centraal, then tram 4 towards Station RAI,
exit at Ceintuurbaan (8th stop, ~16 min). Hotel is left of the tram stop.

---

## Conflicts and stale content on the source site

Carry these over only once resolved with the hotel.

1. **Check-out time contradicts itself.** The homepage says 12:00; /facilities and /faq both say 11:00. The offers page frames "late checkout until 12:00" as a direct-booking perk, which suggests 11:00 is standard, but the homepage undercuts that.
2. **Late checkout is free or €50, depending on the page.** /offers gives it away to direct bookers; /faq charges €50 until 13:00.
3. **The lift notice is out of date.** /faq dates the outage 23 February to mid-June 2026, which has passed. /facilities still says the lift is out of service with no dates.
4. **Renovation hours** (Mon–Fri 09:00–17:00) are still advertised on /facilities and may also be finished.
