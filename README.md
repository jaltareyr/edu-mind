# Next.js Application Template

This repository serves as a template for building a Next.js application with a monorepo structure, containing both `client` and `server` directories.

## Features

- **Client**: A Next.js 14 application configured with the App Router, utilizing Tailwind CSS for styling.
- **Server**: An Express.js server setup to handle backend logic and API routes.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jaltareyr/next-app-template.git
   cd next-app-template
   ```

2. **Install dependencies for both client and server**:

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

### Running the Application

1. **Start the server**:

   ```bash
   cd server
   npm run dev
   ```

   This will start the Express.js server on `http://localhost:5000`.

2. **Start the client**:

   Open a new terminal window and run:

   ```bash
   cd client
   npm run dev
   ```

   This will start the Next.js application on `http://localhost:3000`.

## Project Structure

```
next-app-template/
├── client/         # Next.js application
│   ├── pages/      # Page components
│   ├── public/     # Public assets
│   ├── styles/     # Global styles
│   └── ...         # Other Next.js specific folders and files
└── server/         # Express.js server
    ├── routes/     # API routes
    ├── models/     # Database models
    └── ...         # Other server-specific folders and files
```

## Scripts

### Client

- **`npm run dev`**: Runs the Next.js development server.
- **`npm run build`**: Builds the application for production.
- **`npm run start`**: Starts the production build.

### Server

- **`npm run dev`**: Runs the Express.js server in development mode.
- **`npm run start`**: Starts the Express.js server in production mode.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Note: This template is inspired by various Next.js starter templates, including those from [nextui-org](https://github.com/nextui-org/next-app-template) and [mantinedev](https://github.com/mantinedev/next-app-template).*