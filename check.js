const coords = [
  {name: 'Timimoun', lat: 29.2639, lng: 0.2303},
  {name: 'Bordj Badji Mokhtar', lat: 21.3271, lng: 0.9538},
  {name: 'Ouled Djellal', lat: 34.4272, lng: 5.0647},
  {name: 'Beni Abbes', lat: 30.0833, lng: -2.1667},
  {name: 'In Guezzam', lat: 19.5656, lng: 5.7725},
  {name: 'Touggourt', lat: 33.1000, lng: 6.0667},
  {name: 'Djanet', lat: 24.5550, lng: 9.4857},
  {name: 'El M\'Ghair', lat: 33.9500, lng: 5.9167},
  {name: 'El Meniaa', lat: 30.5833, lng: 2.8833},
  {name: 'Bou Saâda', lat: 35.2122, lng: 4.1731},
  {name: 'Bir El Ater', lat: 34.7477, lng: 8.0617}
];

async function test() {
  for (const c of coords) {
    let url = `https://api.aladhan.com/v1/calendar/2026?latitude=${c.lat}&longitude=${c.lng}&method=19`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      let t = data.data["6"][15].timings.Dhuhr;
      console.log(`${c.name}: ${t}`);
    } catch (e) {}
  }
}
test();
