/* ==========================================================================
   WEDDING DETAILS — edit everything here.
   Every name, date, time, venue and programme item on the site comes from
   this file. Save, refresh the page, done.
   ========================================================================== */
window.WEDDING = {
  // Short names shown big in the hero (script font)
  groom: {
    short: "Rizan",
    full: "Mohamed Rizan",
    relation: "Son of",
    parents: ["Mr. Abdul Haleem", "Mrs. Fathima Rifka"],
  },
  bride: {
    short: "Hana",
    full: "Fathima Hana",
    relation: "Daughter of",
    parents: ["Mr. Mohamed Ismail", "Mrs. Sithy Nazeera"],
  },

  // Countdown target + calendar file. Use local time "YYYY-MM-DDTHH:MM".
  dateISO: "2027-04-18T10:30",
  durationHours: 6,
  dateLabel: "Sunday · 18 April 2027",
  city: "Colombo",
  hashtag: "#RizanWedsHana",

  // Main venue (Walima)
  venue: {
    name: "The Grand Crystal Ballroom",
    address: "123 Galle Road, Colombo 03, Sri Lanka",
    // Google Maps search text (or paste a full maps link in mapsLink)
    mapsQuery: "Galle Road, Colombo 03, Sri Lanka",
    mapsLink: "",
    note: "Ample parking available · Separate prayer area for guests",
  },

  // Event cards
  events: [
    {
      title: "Mehndi Night",
      image: "assets/img/mehndi.jpg",
      icon: "henna",
      date: "Friday · 16 April 2027",
      time: "7:00 PM onwards",
      place: "Bride's Residence, Dehiwala",
      text: "An evening of henna, laughter and family as we begin the celebrations.",
    },
    {
      title: "Nikah Ceremony",
      image: "assets/img/rings.jpg",
      icon: "rings",
      date: "Sunday · 18 April 2027",
      time: "10:30 AM",
      place: "Grand Mosque, Colombo 03",
      text: "The sacred union, solemnised with the blessings of Allah and our families.",
    },
    {
      title: "Walima Reception",
      image: "assets/img/reception.jpg",
      icon: "dine",
      date: "Sunday · 18 April 2027",
      time: "12:30 PM – 4:00 PM",
      place: "The Grand Crystal Ballroom",
      text: "Join us for the Walima feast as we celebrate the beginning of our forever.",
    },
  ],

  // Programme timeline for the wedding day
  programme: [
    { time: "10:30 AM", title: "Nikah Ceremony", text: "Solemnisation of the marriage at the Grand Mosque." },
    { time: "12:00 PM", title: "Guests Arrival", text: "Welcome refreshments at the Grand Crystal Ballroom." },
    { time: "12:30 PM", title: "Arrival of the Couple", text: "The newlyweds make their first entrance together." },
    { time: "1:00 PM",  title: "Khutbah & Dua", text: "A short reminder and duas for the couple's new journey." },
    { time: "1:30 PM",  title: "Walima Feast", text: "Lunch is served. Please join us at your tables." },
    { time: "3:00 PM",  title: "Family Photographs", text: "Moments to treasure with family and friends." },
    { time: "4:00 PM",  title: "Farewell", text: "We bid farewell with gratitude for your presence." },
  ],

  // "Our Story" milestones
  story: [
    { year: "2023", title: "The First Glance", text: "Two families, one gathering, and a quiet moment that changed everything." },
    { year: "2025", title: "The Families Met", text: "With istikhara and the blessings of our parents, two families became one." },
    { year: "2026", title: "The Engagement", text: "Rings exchanged, duas made, and a promise sealed with love." },
    { year: "2027", title: "Our Nikah", text: "In shaa Allah, the day we begin our forever, and we want you there." },
  ],

  // Contact for enquiries
  contact: { label: "Family enquiries", phone: "+94 77 123 4567" },
};
