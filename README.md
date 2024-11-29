# Backend for E-commerce Platform

This project represents the backend for an e-commerce platform, built using Node.js, NestJS, MongoDB, and Redis.

## Technologies Used

- **Node.js** & **NestJS**: Frameworks used to build the backend API.
- **MongoDB**: NoSQL database used for storing application data.
- **Redis**: Used for caching and session management.

## Prerequisites

To run the backend locally, you will need:

- **Node.js** v16+ and **npm**
- **MongoDB** installed locally or accessible through a cloud service
- **Redis** installed locally or accessible through a cloud service

## Setting Up the Project

1. Clone this repository:

    ```bash
    git clone https://github.com/EneCatalinM/ecommerce-backend
    cd ecommerce-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    MONGO_URI=mongodb+srv://enecatalinionut22:20jFbE1ZJMORMzU5@e-commerce-platform.wbaqt.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce-platform
    JWT_SECRET=uUpngRkbBPvumi08wRTEH8eaIG5wp7S4mUxVtnHcbrA=
    EMAIL_USER=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    ELASTICSEARCH_NODE=https://ecommerce-platform.es.europe-west3.gcp.cloud.es.io
    ELASTICSEARCH_USERNAME=elastic
    ELASTICSEARCH_PASSWORD=MIpdCuKgU3WabtRW6RTUUGCg
    ```

4. Start MongoDB and Redis locally:

    - Ensure **MongoDB** and **Redis** are running locally. You can use MongoDB Compass to connect and manage your database. 
    - To start Redis, you can simply run:

      ```bash
      redis-server
      ```

5. Start the backend server:

    ```bash
    npm run start:dev
    ```

The server should now be available at `http://localhost:6060`.

## Useful Commands

- **Development**: `npm run start:dev`
- **Production**: `npm run build && npm run start`
- **Testing**: `npm run test`

## Project Structure

- `src/` - Contains the source code for backend modules, services, and controllers.
- `src/products` - Product modules, including schema for MongoDB and business logic.
- `src/auth` - Authentication and authorization modules.
- `src/users` - Modules for user management.
- `src/orders` - Order management modules, including order creation, cancellation, and viewing orders.
  - `src/cart` - Shopping cart modules, handling adding, updating, and removing products from the cart.

