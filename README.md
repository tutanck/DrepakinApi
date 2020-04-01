<h1 align="center">Welcome to Drepakin 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> This project aims to help sickle cell patients find the specialist hospital closest to the desired location.

# Getting Started for `Development`

0. Copy the content of env.example into a fresh new .env file with the right values (see with the admin)

1. Install dependencies

   ```sh
   npm i
   ```

1. Launch the services (mongodb, etc)

   ```sh
   docker-compose up
   ```

   > This project uses [Docker](https://www.docker.com/) (install it if it is not already installed)

1. Launch the app

   ```sh
   npm run dev
   ```

1. To stop the running services (mongodb, etc)

   ```sh
   docker-compose down
   ```

# Getting Started for `Production`

### Launch the app

```sh
npm start
```

# Scripts

- `npm run init-db` : initialize the database with default expert centers.

- `npm run relocate-ec` : adjust experts centers coordinates in json files from Google Maps api.

- `npm run pretty-ec` : apply prettier on experts centers json files (located in `public/data/json/ecs`)

# Author

👤 **tutanck**

- Twitter: [@tutanck](https://twitter.com/tutanck)
- Github: [@tutanck](https://github.com/tutanck)

# Show your support

Give a ⭐️ to support this project !

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
