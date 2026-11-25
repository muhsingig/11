// Idlewild fleet. Edit this file to change cars, prices or copy.
// Images live in assets/cars/ (transparent background, side view, facing left).

window.BRANDS = [
  { id: "mercedes", name: "Mercedes-Benz", short: "Mercedes" },
  { id: "bmw", name: "BMW", short: "BMW" },
  { id: "porsche", name: "Porsche", short: "Porsche" },
  { id: "bentley", name: "Bentley", short: "Bentley" },
  { id: "rolls", name: "Rolls-Royce", short: "Rolls-Royce" },
  { id: "landrover", name: "Land Rover", short: "Land Rover" },
  { id: "aston", name: "Aston Martin", short: "Aston Martin" }
];

const C = (author, licence, file) => ({ author, licence, file });

window.FLEET = [
  // Mercedes-Benz
  { id: "sclass", brand: "mercedes", name: "S-Class", type: "Saloon", price: 300, more: 4,
    desc: "Long-wheelbase calm. The city goes quiet behind its doors.",
    specs: { Engine: "3.0L inline-6, mild hybrid", Power: "429 hp", "0–60 mph": "4.9 s", Seats: "5, reclining rear", Drive: "4MATIC" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2019 Mercedes-Benz S350d L AMG Line Executive 3.0 Side.jpg") },
  { id: "maybach", brand: "mercedes", name: "Maybach S 580", type: "Saloon", price: 900, more: 2,
    desc: "Two-tone paint, rear seats that recline flat, champagne flutes in the console.",
    specs: { Engine: "4.0L twin-turbo V8", Power: "496 hp", "0–60 mph": "4.7 s", Seats: "4, executive rear", Drive: "4MATIC" },
    credit: C("Dinkun Chen", "CC BY-SA 4.0", "MERCEDES MAYBACH S-CLASS (W223) China (21).jpg") },
  { id: "g63", brand: "mercedes", name: "AMG G 63", type: "SUV", price: 750, more: 3,
    desc: "Square, loud and completely unbothered. The doors still close like a vault.",
    specs: { Engine: "4.0L twin-turbo V8", Power: "577 hp", "0–60 mph": "4.4 s", Seats: "5", Drive: "All-wheel, three locking diffs" },
    credit: C("Alexandre Prevot", "CC BY-SA 4.0", "Mercedes-AMG G 63 - 54644135664.jpg") },

  // BMW
  { id: "bmw7", brand: "bmw", name: "7 Series", type: "Saloon", price: 320, more: 4,
    desc: "A 31-inch theatre screen folds down from the roof. Bring a film.",
    specs: { Engine: "3.0L inline-6, plug-in hybrid", Power: "483 hp", "0–60 mph": "4.6 s", Seats: "5", Drive: "xDrive" },
    credit: C("Dinkun Chen", "CC BY-SA 4.0", "BMW 7 SERIES (G70) China (11).jpg") },
  { id: "x7", brand: "bmw", name: "X7", type: "SUV", price: 340, more: 5,
    desc: "Three rows, seven seats, and a ride that ignores every pothole on the FDR.",
    specs: { Engine: "3.0L inline-6", Power: "375 hp", "0–60 mph": "5.6 s", Seats: "7", Drive: "xDrive, air suspension" },
    credit: C("OWS Photography", "CC BY 4.0", "BMW X7 (G07) Washington DC Metro Area, USA (6).jpg") },
  { id: "m8", brand: "bmw", name: "M8 Competition", type: "Coupé", price: 480, more: 2,
    desc: "Grand tourer manners until you press the red M button.",
    specs: { Engine: "4.4L twin-turbo V8", Power: "617 hp", "0–60 mph": "3.0 s", Seats: "4", Drive: "M xDrive" },
    credit: C("Alexander Migl", "CC BY-SA 4.0", "BMW M8 Competition IMG 5708.jpg") },

  // Porsche
  { id: "p911", brand: "porsche", name: "911 Carrera", type: "Coupé", price: 520, more: 3,
    desc: "Sixty years of the same silhouette, because they got it right the first time.",
    specs: { Engine: "3.0L twin-turbo flat-6", Power: "379 hp", "0–60 mph": "3.9 s", Seats: "2+2", Drive: "Rear-wheel" },
    credit: C("Alexandre Prevot", "CC BY-SA 4.0", "Porsche 992 Carrera (2).jpg") },
  { id: "taycan", brand: "porsche", name: "Taycan GTS", type: "Electric", price: 450, more: 4,
    desc: "Silent at the lights, then gone. Charged to 100% before every handover.",
    specs: { Motor: "Dual electric", Power: "590 hp", "0–60 mph": "3.5 s", Seats: "4", Range: "260 miles" },
    credit: C("Aos.1905", "CC BY 4.0", "Porsche Taycan GTS (side view) (taken in 2022) (Kyoto, Japan).jpg") },
  { id: "cayenne", brand: "porsche", name: "Cayenne", type: "SUV", price: 360, more: 5,
    desc: "The family car that still knows its way around a back road.",
    specs: { Engine: "3.0L turbo V6", Power: "348 hp", "0–60 mph": "5.7 s", Seats: "5", Drive: "All-wheel" },
    credit: C("Jengtingchen", "CC BY-SA 4.0", "Porsche Cayenne III 002.jpg") },

  // Bentley
  { id: "bentley", brand: "bentley", name: "Continental GT", type: "Coupé", price: 650, more: 2,
    desc: "Hand-stitched cabin, a W12 that never raises its voice.",
    specs: { Engine: "6.0L W12 twin-turbo", Power: "626 hp", "0–60 mph": "3.6 s", Seats: "4", Drive: "All-wheel" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2019 Bentley Continental GT Coupe 6.0 Side.jpg") },
  { id: "flyingspur", brand: "bentley", name: "Flying Spur", type: "Saloon", price: 700, more: 3,
    desc: "The Continental's manners with four doors and room to stretch out.",
    specs: { Engine: "6.0L W12 twin-turbo", Power: "626 hp", "0–60 mph": "3.7 s", Seats: "5", Drive: "All-wheel" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2019 Bentley Flying Spur W12 Side.jpg") },
  { id: "bentayga", brand: "bentley", name: "Bentayga", type: "SUV", price: 620, more: 3,
    desc: "British racing green, quilted leather and enough boot for a weekend upstate.",
    specs: { Engine: "4.0L twin-turbo V8", Power: "542 hp", "0–60 mph": "4.4 s", Seats: "5", Drive: "All-wheel" },
    credit: C("Alexandre Prevot", "CC BY-SA 2.0", "Bentley Bentayga (50159906372).jpg") },

  // Rolls-Royce
  { id: "phantom", brand: "rolls", name: "Phantom", type: "Saloon", price: 1500, more: 1,
    desc: "The flagship. Coach doors, a starlit headliner and a ride like still water.",
    specs: { Engine: "6.75L twin-turbo V12", Power: "563 hp", "0–60 mph": "5.1 s", Seats: "5", Extras: "Chauffeur on request" },
    credit: C("Alexander Migl", "CC BY-SA 4.0", "Rolls-Royce Phantom VIII Genf 2018.jpg") },
  { id: "spectre", brand: "rolls", name: "Spectre", type: "Electric", price: 1100, more: 2,
    desc: "Silent, electric, and every inch a Rolls-Royce. Starlight doors included.",
    specs: { Motor: "Dual electric", Power: "577 hp", "0–60 mph": "4.4 s", Seats: "4", Range: "266 miles" },
    credit: C("Harvey Bold", "CC0", "2023 Rolls-Royce Spectre EV - 102kWh (585PS) Electric - Wittering Blue - 06-2024, Side.jpg") },
  { id: "cullinan", brand: "rolls", name: "Cullinan", type: "SUV", price: 1250, more: 3,
    desc: "The quietest way to arrive with five friends and all of their luggage.",
    specs: { Engine: "6.75L twin-turbo V12", Power: "563 hp", "0–60 mph": "4.8 s", Seats: "5", Drive: "All-wheel, all-terrain" },
    credit: C("Harvey Bold", "CC0", "2024 Rolls-Royce Cullinan V12 - 6749cc 6.75 (571PS) Petrol - Salamanca Blue - 01-2025, Side.jpg") },

  // Land Rover
  { id: "rangerover", brand: "landrover", name: "Range Rover SV", type: "SUV", price: 520, more: 4,
    desc: "Commanding height and a cashmere-soft cabin. Built for the long way round.",
    specs: { Engine: "4.4L twin-turbo V8", Power: "606 hp", "0–60 mph": "4.3 s", Seats: "5", Drive: "All-wheel, air suspension" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2023 Land Rover Range Rover SV Automatic 4.4 Side.jpg") },
  { id: "rrsport", brand: "landrover", name: "Range Rover Sport", type: "SUV", price: 390, more: 5,
    desc: "Lower, quicker and better looking than it has any right to be.",
    specs: { Engine: "3.0L inline-6, mild hybrid", Power: "395 hp", "0–60 mph": "5.4 s", Seats: "5", Drive: "All-wheel" },
    credit: C("Damian B Oh", "CC BY-SA 4.0", "Land Rover Range Rover Sport L461 Varesine Blue (7).jpg") },
  { id: "defender", brand: "landrover", name: "Defender 110", type: "SUV", price: 290, more: 6,
    desc: "Roof rack, ladder and mud tyres. For the weekend that doesn't end at a valet stand.",
    specs: { Engine: "3.0L inline-6, mild hybrid", Power: "395 hp", "0–60 mph": "5.8 s", Seats: "5", Drive: "All-wheel, terrain response" },
    credit: C("Aos.1905", "CC BY-SA 4.0", "Land Rover Defender L663 (Side view) at Japan Mobility Show Kansai 2025.jpg") },

  // Aston Martin
  { id: "dbs", brand: "aston", name: "DBS Superleggera", type: "Coupé", price: 720, more: 1,
    desc: "Superleggera means superlight. The V12 means nothing else about it is.",
    specs: { Engine: "5.2L twin-turbo V12", Power: "715 hp", "0–60 mph": "3.2 s", Seats: "2+2", Drive: "Rear-wheel" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2018 Aston Martin DBS Superleggera V12 Automatic 5.2 Side.jpg") },
  { id: "db11", brand: "aston", name: "DB11", type: "Coupé", price: 580, more: 2,
    desc: "The long bonnet, the short tail, the soundtrack. Pure grand tourer.",
    specs: { Engine: "4.0L twin-turbo V8", Power: "528 hp", "0–60 mph": "3.9 s", Seats: "2+2", Drive: "Rear-wheel" },
    credit: C("Vauxford", "CC BY-SA 4.0", "2018 Aston Martin DB11 V8 Automatic 4.0 Side.jpg") },
  { id: "dbx", brand: "aston", name: "DBX", type: "SUV", price: 600, more: 3,
    desc: "An Aston Martin with a boot big enough for the golf clubs and the dog.",
    specs: { Engine: "4.0L twin-turbo V8", Power: "542 hp", "0–60 mph": "4.3 s", Seats: "5", Drive: "All-wheel" },
    credit: C("Damian B Oh", "CC BY-SA 4.0", "Aston Martin DBX AM8 Gold (3).jpg") }
];

window.FLEET.forEach((c) => {
  c.img = `assets/cars/${c.id}.webp`;
  c.brandName = window.BRANDS.find((b) => b.id === c.brand).name;
  c.full = `${c.brandName} ${c.name}`;
});
