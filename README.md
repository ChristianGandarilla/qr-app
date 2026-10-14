# QR App

This project is a lightweight application to generate QR codes from a URL. It uses Node.js, Express, and the `qrcode` library to create QR images that can be returned as PNG or SVG.

## Objective

The main goal of this project is to turn a web address into a QR code quickly and easily. The app validates the URL, normalizes it if needed, and generates a QR image for use in websites, documents, or marketing materials.

## Features

- Generate QR codes from a URL
- Accepts URLs with or without a protocol
- Returns QR images in PNG or SVG format
- Allows customization of size, colors, and error correction level
- Supports file download behavior via query parameters
- Validates suspicious or invalid URLs before generating the QR

## Tech Stack

- Node.js
- Express
- `qrcode`
- CORS

## Project Structure

```text
qr-app/
├── server/
│   ├── node_modules/
│   ├── package.json
│   └── server.js
├── .gitignore
├── README.md
├── REDME.md
└── ...
```

## Installation

1. Open a terminal in the project folder.
2. Go to the server directory:

```bash
cd server
```

3. Install the dependencies:

```bash
npm install
```

## Run the project

Start the API server:

```bash
npm run dev
```

The server will run on:

```text
http://localhost:5000
```

## API Usage

### Endpoint

```http
GET /api/qr
```

### Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `url` | URL to encode in the QR code. Required. | `example.com` |
| `format` | Output format: `png` or `svg` | `png` |
| `size` | QR image width in pixels | `512` |
| `fg` | Foreground color in hex format | `#000000` |
| `bg` | Background color in hex format | `#ffffff` |
| `ec` | Error correction level: `L`, `M`, `Q`, `H` | `M` |
| `download` | If present, the response is sent as a downloadable file | `1` |

### Examples

Generate a PNG QR code from a URL:

```bash
curl "http://localhost:5000/api/qr?url=example.com&format=png&size=512" -o qr.png
```

Generate a QR code from a GitHub URL and save it as SVG:

```bash
curl "http://localhost:5000/api/qr?url=https://github.com&format=svg" -o github-qr.svg
```

Generate a downloadable PNG QR with custom colors:

```bash
curl "http://localhost:5000/api/qr?url=example.com&format=png&size=700&fg=%23000000&bg=%23ffffff&download=1" -o qr-custom.png
```

## Behavior

- If the URL does not include a protocol, the server automatically adds `https://`.
- If the URL is invalid, the API responds with a 400 status.
- If the URL is too long for a QR code, the API responds with an error message.

## Example Response

For valid requests, the API returns the QR image directly as a binary response (`image/png` or `image/svg+xml`).

For invalid input, the server may return:

```json
{
  "error": "URL inválida"
}
```

## Notes

This project is a simple and practical QR generator focused on a URL-based workflow. It can be used as a backend API or can be expanded later with a frontend interface.

## License

Christian Gandarilla
