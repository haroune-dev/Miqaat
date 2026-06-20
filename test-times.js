const coords = [
  {id: 59, name: 'Timimoun', lat: 29.2639, lng: 0.2303},
  {id: 60, name: 'Bordj Badji Mokhtar', lat: 21.3271, lng: 0.9538},
  {id: 61, name: 'Ouled Djellal', lat: 34.4272, lng: 5.0647},
  {id: 62, name: 'Beni Abbes', lat: 30.0833, lng: -2.1667},
  {id: 63, name: 'In Guezzam', lat: 19.5656, lng: 5.7725},
  {id: 64, name: 'Touggourt', lat: 33.1000, lng: 6.0667},
  {id: 65, name: 'Djanet', lat: 24.5550, lng: 9.4857},
  {id: 66, name: 'El M\'Ghair', lat: 33.9500, lng: 5.9167},
  {id: 67, name: 'El Meniaa', lat: 30.5833, lng: 2.8833},
  {id: 'sub1', name: 'Bou Saâda', lat: 35.2122, lng: 4.1731},
  {id: 'sub2', name: 'Bir El Ater', lat: 34.7477, lng: 8.0617}
];

async function test() {
  for (const c of coords) {
    let urlAddr = `https://api.aladhan.com/v1/calendarByAddress/2026?address=${c.lat},${c.lng}&method=19&month=6`;
    let urlCoord = `https://api.aladhan.com/v1/calendar/2026?latitude=${c.lat}&longitude=${c.lng}&method=19&month=6`;
    
    try {
      let resA = await fetch(urlAddr);
      let dataA = await resA.json();
      let tA = dataA.data[15].timings.Dhuhr;
      let latA = dataA.data[15].meta.latitude;
      
      let resC = await fetch(urlCoord);
      let dataC = await resC.json();
      let tC = dataC.data[15].timings.Dhuhr;
      let latC = dataC.data[15].meta.latitude;
      
      console.log(`${c.name}: ByAddress Dhuhr=${tA} (lat=${latA}) | ByCoord Dhuhr=${tC} (lat=${latC})`);
    } catch (e) {
      console.log(c.name, 'error', e.message);
    }
  }
}
test();
