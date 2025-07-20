export const bookings = [
  {
    id: 1,
    userId: 1,
    flightId: 1,
    bookingReference: 'FB001234',
    passengers: [
      {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        seatNumber: '12A'
      }
    ],
    totalAmount: 15000,
    bookingDate: '2024-12-20T10:30:00Z',
    status: 'Confirmed',
    paymentMethod: 'Credit Card',
    contactInfo: {
      email: 'john@example.com',
      phone: '+1234567890'
    }
  },
  {
    id: 2,
    userId: 1,
    flightId: 2,
    bookingReference: 'FB001235',
    passengers: [
      {
        name: 'John Doe',
        age: 30,
        gender: 'Male',
        seatNumber: '15C'
      }
    ],
    totalAmount: 45000,
    bookingDate: '2024-12-21T14:20:00Z',
    status: 'Confirmed',
    paymentMethod: 'Debit Card',
    contactInfo: {
      email: 'john@example.com',
      phone: '+1234567890'
    }
  }
];