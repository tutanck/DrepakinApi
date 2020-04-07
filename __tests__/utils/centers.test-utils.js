const centers = [
  {
    _id: '5e7729bf4d479f4cfa958acf',
    __v: 0,
    id: '5e7729bf4d479f4cfa958acf', // fictive mongoose proxy
    country: 'UNITED KINGDOM',
    region: 'Berkshire',
    city: 'READING',
    hospital: 'The Royal Berkshire NHS Foundation Trust',
    name: 'Sickle Cell And Thalassaemia Clinic',
    name_en: 'Sickle Cell And Thalassaemia Clinic',
    address:
      'Reading Sickle Cell And Thalassaemia Service Haematology Department The Royal Berkshire NHS Foundation Trust London Road  READING RG1 5AN UNITED KINGDOM',
    consultation_managers: ['Mme Sarah CONNOLLY'],
    phones: ['44 (0)118 987 5111'],
    for_children: true,
    for_adults: true,
    specialized_consultation: true,
    officially_designated: false,
    ern_member: false,
    website: 'https://www.royalberkshire.nhs.uk/',
    location: {
      type: 'Point',
      coordinates: [-0.9571647000000001, 51.4494365],
    },
    meta: {
      place: {
        formattedAddress: 'London Rd, Reading RG1 5AN, UK',
        latitude: 51.4494365,
        longitude: -0.9571647000000001,
        extra: {
          googlePlaceId: 'ChIJAwX1sJt6dkgRMW3z3lzQAis',
          confidence: 0.7,
          premise: null,
          subpremise: null,
          neighborhood: 'Reading',
          establishment: null,
        },
        administrativeLevels: {
          level2long: 'Reading',
          level2short: 'Reading',
          level1long: 'England',
          level1short: 'England',
        },
        streetName: 'London Road',
        city: 'Reading',
        country: 'United Kingdom',
        countryCode: 'GB',
        zipcode: 'RG1 5AN',
        provider: 'google',
      },
    },
  },
];

module.exports = { centers };
