# Product Browser API

A backend application built for the CodeVector internship assignment.

The system supports browsing a large product catalog (~200,000 products) with fast pagination, category filtering, and consistent results even when new products are inserted while a user is actively browsing.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Neon Database
* Vanilla HTML/CSS/JavaScript (optional UI)

---

## Features

### Product Browsing

* Browse products sorted by newest first.
* Category-based filtering.
* Cursor-based pagination.
* Stable ordering using:

  * `createdAt DESC`
  * `id DESC`

### Consistency Under Concurrent Inserts

New products can be added while users are browsing.

The pagination strategy ensures:

* No duplicate products are shown.
* No products are skipped.
* Newly inserted products do not affect the current browsing session.

### Product Generation

Generate up to 200,000 products using a bulk insertion endpoint.

Each product contains:

* id
* name
* category
* price
* createdAt
* updatedAt

### Database Optimizations

Indexes are created on:

* `(createdAt, id)`
* `category`

to support efficient pagination and filtering.

---

## API Endpoints

### Health Check

```http
GET /health
```

### Get Products

```http
GET /products
```

Query Parameters:

```text
limit=20
category=Books
cursor=<cursor>
```

Example:

```http
GET /products?limit=20&category=Books
```

---

### Seed Products

```http
POST /products/seed
```

Request:

```json
{
  "count": 1000
}
```

Maximum total products allowed:

```text
200000
```

---

### Product Count

```http
GET /products/count
```

Returns total products currently stored.

---

## Cursor Pagination Design

Offset pagination was intentionally avoided.

Using offsets:

```sql
LIMIT 20 OFFSET 40
```

can lead to duplicate or missing records when new products are inserted between page requests.

Instead, this project uses cursor pagination based on:

```text
(createdAt, id)
```

Cursor example:

```json
{
  "createdAt": "2026-06-22T12:00:00.000Z",
  "id": 141181
}
```

This guarantees stable traversal of the dataset even while writes are occurring.

---

## Testing Consistency

To verify pagination consistency:

1. Open the application.
2. Load the first page of products.
3. Note the last visible product ID.
4. Add 50 new products using the UI.
5. Without refreshing, click "Next Page".
6. Verify that:

   * previously viewed products are not repeated
   * products are not skipped
   * browsing continues from the correct position

---

## Running Locally

Install dependencies:

```bash
npm install
```

Run migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the server:

```bash
npm start
```

Development:

```bash
npm run dev
```

---

## Design Decisions

* Cursor pagination over offset pagination.
* PostgreSQL for reliable ordering and indexing.
* Bulk inserts using Prisma `createMany`.
* Stable composite ordering with `(createdAt, id)`.
* Simple UI focused on demonstrating backend behavior rather than frontend complexity.

---

## Future Improvements

* Price range filters.
* Sorting options.
* Search by product name.
* Background job based bulk imports.
* Caching frequently requested pages.
* API rate limiting and authentication.
