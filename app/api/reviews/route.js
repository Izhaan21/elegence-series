import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace this mock implementation with actual Google Places API call
  // const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  // const placeId = process.env.GOOGLE_PLACE_ID;
  // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
  
  const mockReviews = [
    {
      author_name: "Sarah Jenkins",
      author_url: "https://www.google.com/maps/contrib/12345",
      profile_photo_url: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random",
      rating: 5,
      relative_time_description: "2 weeks ago",
      text: "Absolutely stunning pieces. We purchased the Modern Gold Halo Chandelier for our dining room and it completely transformed the space. The quality is exceptional and the customer service was extremely helpful during the selection process.",
      time: 1679000000
    },
    {
      author_name: "Michael Chen",
      author_url: "https://www.google.com/maps/contrib/23456",
      profile_photo_url: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
      rating: 5,
      relative_time_description: "1 month ago",
      text: "The architectural cove lighting we installed looks flawless. Very impressed with the build quality of the extrusions and the lack of glare from the LEDs. Will definitely be specifying Elegence Series for future client projects.",
      time: 1677000000
    },
    {
      author_name: "Eleanor Vance",
      author_url: "https://www.google.com/maps/contrib/34567",
      profile_photo_url: "https://ui-avatars.com/api/?name=Eleanor+Vance&background=random",
      rating: 5,
      relative_time_description: "2 months ago",
      text: "Beautiful outdoor lighting that actually holds up to the weather. The matte black bollards add such a luxurious feel to our pathway at night. Highly recommend!",
      time: 1674000000
    },
    {
      author_name: "David Rossi",
      author_url: "https://www.google.com/maps/contrib/45678",
      profile_photo_url: "https://ui-avatars.com/api/?name=David+Rossi&background=random",
      rating: 4,
      relative_time_description: "3 months ago",
      text: "Great selection of minimalist lighting. The linear pendant I bought was easy to install and the color temperature is perfect. Shipping took a day longer than expected, but the product was worth the wait.",
      time: 1671000000
    },
    {
      author_name: "Amanda Sterling",
      author_url: "https://www.google.com/maps/contrib/56789",
      profile_photo_url: "https://ui-avatars.com/api/?name=Amanda+Sterling&background=random",
      rating: 5,
      relative_time_description: "4 months ago",
      text: "I was hesitant to buy lighting online without seeing it first, but Elegence Series exceeded my expectations. The brass finish on the wall sconces is incredibly rich and premium.",
      time: 1668000000
    }
  ];

  return NextResponse.json({
    result: {
      rating: 4.9,
      user_ratings_total: 128,
      reviews: mockReviews
    },
    status: "OK"
  });
}
