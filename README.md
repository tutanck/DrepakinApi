<h1 align="center">Welcome to Drepakin 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://twitter.com/tutanck" target="_blank">
    <img alt="Twitter: tutanck" src="https://img.shields.io/twitter/follow/tutanck.svg?style=social" />
  </a>
</p>

> This project aims to help sickle cell patients find the nearest specialist hospital.

### ✨ [drepakin.com](https://drepakin.com/)

### 💻 [React App](https://github.com/tutanck/Drepakin)

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

- `npm run pretty-ec` : apply prettier on experts centers json files (located in `secret/data/json/ecs`)

## Author

👤 **tutanck**

- Twitter: [@tutanck](https://twitter.com/tutanck)
- Github: [@tutanck](https://github.com/tutanck)
- LinkedIn: [@tutanck](https://www.linkedin.com/in/joan-anagbla-90628250/)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/tutanck/DrepakinApi/issues).

## Show your support

Give a ⭐️ to support this project !

<a href="https://www.patreon.com/user?u=30635668&fan_landing=true">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
