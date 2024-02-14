# VZY Assessment

## Table of Contents

-   About
    -   Description of the project
    -   Technologies used
-   Getting Started
    -   Prerequisites
    -   Installation
-   Features
-   Postman Documentation
-   License
    <br>

### About

This project is part of VZY's assessment and it aims to showcase my skills and understanding of backend technologies as well as my error-handling mechanism and code structure

#### Description of the Project:

A simple REST API to register new users and authenticate existing users. Authenticated users can then perform subsequent request with the help of an access token. Authorized users can then make payment using Stripe

#### Technologies used:

1. Node.js
2. TypeScript
3. Mongo.DB
4. Stripe
   <br>

### Getting Started

Follow these instruction to get the project up and running on your local machine for development and testing purposes.

#### Prerequisites

-   [Node.js](https://nodejs.org/en/) installed.
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager.

#### Installation

1. Clone the repository: <br>
   <code>git clone [https://github.com/pick-cee/vzy-assessment.git](https://github.com/pick-cee/vzy-assessment)</code>
2. Navigate to the project directory: <br>
   `cd vzy-assessment`
3. Install dependencies: <br>
   <code> npm install</code>
   <br> or <br>
   <code>yarn</code>

4. Run the development server: <br>
   <code> npm run dev</code>
   <br> or <br>
   <code>yarn start</code>
   <br>

The application will be available at `http://localhost:8080`.
<br>

### Features

-   Sign up with a unique email and password
-   Authenticated users can update their details and change passwords. They can also make payment for a premuim plan.
-   Custom success and error responses were implemented.
    <br>

### Postman Documentation

The postman documentation contains all the available endpoints with sample requests and responses for each endpooint. The link to the docs is attached below:
[postman docs]().

### License

This project is licensed under the ISC License.
