export const flights = [
  {
    id: 1,
    flightNumber: 'PK-301',
    airline: 'Pakistan International Airlines',
    aircraft: 'Boeing 777',
    from: 'Karachi',
    to: 'Lahore',
    departure: '2024-12-25T08:00:00Z',
    arrival: '2024-12-25T10:30:00Z',
    duration: '2h 30m',
    price: 15000,
    availableSeats: 45,
    totalSeats: 180,
    class: 'Economy',
    status: 'On Time'
  },
  {
    id: 2,
    flightNumber: 'AI-502',
    airline: 'Airblue',
    aircraft: 'Airbus A320',
    from: 'Islamabad',
    to: 'Dubai',
    departure: '2024-12-25T14:00:00Z',
    arrival: '2024-12-25T18:00:00Z',
    duration: '3h 00m',
    price: 45000,
    availableSeats: 23,
    totalSeats: 150,
    class: 'Economy',
    status: 'On Time'
  },
  {
    id: 3,
    flightNumber: 'SV-785',
    airline: 'Saudi Airlines',
    aircraft: 'Boeing 787',
    from: 'Lahore',
    to: 'Riyadh',
    departure: '2024-12-26T02:30:00Z',
    arrival: '2024-12-26T06:00:00Z',
    duration: '4h 30m',
    price: 52000,
    availableSeats: 67,
    totalSeats: 200,
    class: 'Economy',
    status: 'On Time'
  },
  {
    id: 4,
    flightNumber: 'EK-620',
    airline: 'Emirates',
    aircraft: 'Airbus A380',
    from: 'Karachi',
    to: 'Dubai',
    departure: '2024-12-25T23:45:00Z',
    arrival: '2024-12-26T02:15:00Z',
    duration: '2h 30m',
    price: 65000,
    availableSeats: 12,
    totalSeats: 350,
    class: 'Business',
    status: 'On Time'
  }
];

export const aircraft = [
  {
    id: 1,
    model: 'Boeing 777',
    manufacturer: 'Boeing',
    capacity: 180,
    range: '9700 km',
    image: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg',
    specifications: {
      length: '63.7 m',
      wingspan: '60.9 m',
      height: '18.5 m',
      maxSpeed: '905 km/h'
    }
  },
  {
    id: 2,
    model: 'Airbus A320',
    manufacturer: 'Airbus',
    capacity: 150,
    range: '6150 km',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg',
    specifications: {
      length: '37.6 m',
      wingspan: '35.8 m',
      height: '11.8 m',
      maxSpeed: '871 km/h'
    }
  },
  {
    id: 3,
    model: 'Boeing 787',
    manufacturer: 'Boeing',
    capacity: 200,
    range: '14140 km',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg',
    specifications: {
      length: '56.7 m',
      wingspan: '60.1 m',
      height: '17.0 m',
      maxSpeed: '913 km/h'
    }
  }
];