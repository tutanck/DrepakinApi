const users = [
  {
    _id: '5e7729bf4d479f4cfa958acf',
    google_id: '118342140944253767981',
    __v: 0,
    updated_at: '2020-03-22T12:44:57.343+00:00',
    locale: 'fr',
    family_name: 'Angb',
    given_name: 'Joan',
    picture:
      'https://lh4.googleusercontent.com/-AR9XnzNPh_I/AAAAAAAAAAI/AAAAAAAAD7M/AKF05nAeN5FzGyOdcC3vCQ_wJIpssNa0Xw/s96-c/photo.jpg',
    name: 'Joan Angb',
    email: 'tutanck@gmail.com',
    is_admin: false,
    created_at: '2020-03-22T09:04:09.772+00:00',
  },
  {
    _id: '5e7729bf4d479f4cfa958ade',
    google_id: '118342140944253767999',
    __v: 0,
    updated_at: '2020-03-27T12:46:37.343+00:00',
    locale: 'fr',
    family_name: 'Drepakin',
    given_name: 'World',
    picture:
      'https://lh4.googleusercontent.com/-AR9XnzNPh_I/AAAAAAAAAAI/AAAAAAAAD7M/AKF05nAeN5FzGyOdcC3vCQ_wJIpssNa0Xw/s96-c/photo.jpg',
    name: 'Drepakin World',
    email: 'drepakin@gmail.com',
    is_admin: true,
    created_at: '2020-02-22T09:01:01.772+00:00',
  },
];

const googleUser = {
  google_id: '118342140944253767981',
  locale: 'fr',
  family_name: 'Angb',
  given_name: 'Joan',
  picture:
    'https://lh4.googleusercontent.com/-AR9XnzNPh_I/AAAAAAAAAAI/AAAAAAAAD7M/AKF05nAeN5FzGyOdcC3vCQ_wJIpssNa0Xw/s96-c/photo.jpg',
  name: 'Joan Angb',
  email: 'tutanck@gmail.com',
  authToken:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUzYzY2YWFiNTBjZmRkOTFhMTQzNTBhNjY0ODJkYjM4MDBjODNjNjMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTQzODA2NzA2NjcxLWxldmwzMmk4M2wyc2JtYWJubmVlcnAybnRhampwdjB0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTQzODA2NzA2NjcxLWxldmwzMmk4M2wyc2JtYWJubmVlcnAybnRhampwdjB0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MzQyMTQwOTQ0MjUzNzY3OTgxIiwiZW1haWwiOiJ0dXRhbmNrQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZGlNMHNiZjBhOXh2bHE1UnY1QURmUSIsIm5hbWUiOiJKb2FuIEFuZ2IiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1BUjlYbnpOUGhfSS9BQUFBQUFBQUFBSS9BQUFBQUFBQUQ3TS9BS0YwNW5BZU41RnpHeU9kY0MzdkNRX3dKSXBzc05hMFh3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJKb2FuIiwiZmFtaWx5X25hbWUiOiJBbmdiIiwibG9jYWxlIjoiZnIiLCJpYXQiOjE1ODUwNzgzNTUsImV4cCI6MTU4NTA4MTk1NSwianRpIjoiMTk5NmRhMGY1YzVhZGZiZjE2NzUzZjE0NWY2NDJiNmMyODI4NDQ5MiJ9.mB_fwTq4K3Ip93k2tPYKLYNTq75klwjotNNFIKcAFtwjTiIvrj8IX6Tqflu3Ms6jiU0CeVobfWDQUlL7T0dV-x8-BAVMctwdTsY5b-Mj0HBM7mRI8an4sthp8xJtisDr39L216n-mVefwmN4WIxKtIEiVnPQaGDPjBf7_zBGHBErv3mHuZ68qLCts9BOnPkCWBNQySjVtTpb7T61cIF28puwUXGInS3eLyxEQL7fVS09EtkHObeE38KyrLQZFTLEYewhSs5GqfKOm6LkfnOq6uL0WNmw1CwXpS1A3d_AsQuzjmsGL_POLYN4X1BCyYGUfda6nJmoxnWHDN0F1ZI87Q',
};
module.exports = { users, googleUser };
