---



**Customer Management Backend API**

**Overview**

This is a backend API for managing customer data. It provides endpoints for creating, reading, updating, and deleting customer records. The API is built using Node.js, Express.js, and PostgreSQL.

**Endpoints**

### Create Customer

* **Endpoint:** `/api/customers`
* **Method:** `POST`
* **Request Body:**
  * `name`: string
  * `contact`: string
  * `outstanding_payment`: number
  * `payment_due_date`: date
  * `payment_status`: string
* **Response:** `201 Created` with the newly created customer record

### Get Customer

* **Endpoint:** `/api/customers/:id`
* **Method:** `GET`
* **Path Parameters:**
  * `id`: integer
* **Response:** `200 OK` with the customer record

### Get All Customers

* **Endpoint:** `/api/customers`
* **Method:** `GET`
* **Query Parameters:**
  * `filter`: object (optional)
  * `sort`: object (optional)
* **Response:** `200 OK` with a list of customer records

### Update Customer

* **Endpoint:** `/api/customers/:id`
* **Method:** `PUT`
* **Path Parameters:**
  * `id`: integer
* **Request Body:**
  * `name`: string
  * `contact`: string
  * `outstanding_payment`: number
  * `payment_due_date`: date
  * `payment_status`: string
* **Response:** `200 OK` with the updated customer record

### Delete Customer

* **Endpoint:** `/api/customers/:id`
* **Method:** `DELETE`
* **Path Parameters:**
  * `id`: integer
* **Response:** `204 No Content`

**Database Schema**

The database schema consists of a single table `customers` with the following columns:

* `id`: integer (primary key)
* `name`: string
* `contact`: string
* `outstanding_payment`: number
* `payment_due_date`: date
* `payment_status`: string

**Authentication**

The API uses JSON Web Tokens (JWT) for authentication. The `Authorization` header is required for all endpoints, and the token must be valid and not expired.

**Error Handling**

The API uses a centralized error handling mechanism to catch and handle errors. Error responses are returned in the format `{"error": "error message"}`.

**Security**

The API uses HTTPS encryption to protect data in transit. The database is also encrypted to protect data at rest.

**Dependencies**

* `express`: web framework
* `pg`: PostgreSQL driver
* `jsonwebtoken`: JWT library
* `bcrypt`: password hashing library

**Development**

To develop the API, clone the repository and run `npm install` to install dependencies. Then, run `npm start` to start the API.

**Testing**

To test the API, run `npm test` to run the test suite.
