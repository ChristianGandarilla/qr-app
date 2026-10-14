# QR App

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)
![QRCode](https://img.shields.io/badge/QRCode-Library-00AEEF?style=for-the-badge)

QR App is a lightweight project focused on generating QR codes from URLs. It exposes a simple API that validates a URL, normalizes it when necessary, and returns the QR code as a PNG or SVG image.

## Overview

This project was created to solve a very specific problem: turning any valid website URL into a scannable QR code quickly and reliably.

It is intentionally small and focused on a single workflow:

- receive a URL
- validate it
- generate a QR code
- return the image to the client

## Features

- Generate QR codes from URLs
- Accept URLs with or without a protocol
- Automatically add `https://` when needed
- Validate malformed or empty inputs
- Return images in `png` or `svg` format
- Customize QR size, colors, and error correction level
- Allow direct download of the generated file

## How it works

1. A client sends a request to the API with a `url` parameter.
2. The Express server validates the URL and normalizes it if necessary.
3. The `qrcode` library generates the QR image.
4. The backend returns the image as a binary response.

```text
URL input --> Validation --> QR generation --> PNG/SVG output
```

## Tech Stack

- JavaScript
- Node.js
- Express
- `qrcode`
- CORS

## Project Structure

```text
qr-app/
├── client/
│   └── (frontend files, if added later)
├── server/
│   ├── node_modules/
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
├── REDME.md
├── package-lock.json
└── .git/
```

## Requirements

Before running the project, make sure you have:

- Node.js 18 or newer
- npm installed

## Installation

From the project root, install the server dependencies:

```bash
cd server
npm install
```

## Run the app

Start the backend:

```bash
cd server
npm run dev
```

The app runs on:

```text
http://localhost:5000
```

## API Documentation

### Endpoint

```http
GET /api/qr
```

### Query Parameters

| Parameter | Required | Description | Example |
| --- | --- | --- | --- |
| `url` | Yes | URL to encode in the QR code | `example.com` |
| `format` | No | Output format: `png` or `svg` | `png` |
| `size` | No | QR width in pixels | `512` |
| `fg` | No | Foreground color in hex format | `#000000` |
| `bg` | No | Background color in hex format | `#ffffff` |
| `ec` | No | Error correction: `L`, `M`, `Q`, or `H` | `M` |
| `download` | No | Sends the response as a downloadable file when present | `1` |

### Supported Values

- `format`: `png`, `svg`
- `ec`: `L`, `M`, `Q`, `H`
- `fg` / `bg`: valid 6-digit hex colors such as `#000000` and `#ff6600`

## Behavior

The backend applies several checks before generating the QR:

- trims the input value
- prepends `https://` if missing
- validates the URL using the `URL` API
- returns HTTP 400 for invalid URLs
- limits size to a safe range
- uses default colors if not provided
- returns an error if the URL is too long to encode correctly

## Example Requests

### Generate a PNG QR from a site URL

```bash
curl "http://localhost:5000/api/qr?url=example.com&format=png&size=512" -o qr.png
```

### Generate an SVG QR for GitHub

```bash
curl "http://localhost:5000/api/qr?url=https://github.com&format=svg" -o github-qr.svg
```

### Generate a downloadable QR with custom colors

```bash
curl "http://localhost:5000/api/qr?url=example.com&format=png&size=700&fg=%23000000&bg=%23ffffff&download=1" -o qr-custom.png
```

### Generate a QR with high error correction

```bash
curl "http://localhost:5000/api/qr?url=example.com&format=png&ec=H&size=600" -o qr-high-ec.png
```

## Response Format

A valid request returns the QR image directly as a binary response:

- `image/png` for PNG output
- `image/svg+xml` for SVG output

If the request is invalid, the API returns JSON error data, for example:

```json
{
  "error": "URL inválida"
}
```

When the URL is too long for a QR code, the API may respond with:

```json
{
  "error": "La URL es demasiado larga para un QR"
}
```

## Common Use Cases

- create QR codes for landing pages
- link printed materials to online resources
- share website URLs in mobile-friendly formats
- generate QR codes for internal tools or dashboards

## Current Limitations

This project is intentionally simple and has the following limits:

- backend-only; no full UI is included yet
- only URL-based QR generation is supported
- no persistence or database layer
- no user account system or authentication
- no analytics or tracking built in

## Future Improvements

Possible next steps include:

- building a frontend UI in the `client` folder
- adding tests for validation and QR generation
- supporting more QR types such as text or Wi-Fi data
- allowing custom filenames and response metadata
- adding Docker support
- adding logging and monitoring

## License

This project is distributed under the ISC license.
