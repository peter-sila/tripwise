# TripWise frontend

## Local development

```sh
npm install
npm run dev
```

The Docker Compose frontend service also runs the Vite development server on port 5173.

## Production container

The Dockerfile builds the app with Vite and serves the generated files through Nginx on port 10000. Deploy this image as a web service; client-side routes fall back to `index.html`.
