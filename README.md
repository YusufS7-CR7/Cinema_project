# Cinemagic

Personal movie assistant.

## Development

To run the project locally:

1.  Navigate to the `front` directory: `cd front`
2.  Install dependencies: `npm install`
3.  Set up environment variables in `.env.local`
4.  Run development server: `npm run dev`

Alternatively, from the root:
- `npm run dev`

## Deployment (Vercel)

This project is pre-configured for Vercel deployment.

1.  Connect your GitHub repository to Vercel.
2.  Vercel will automatically detect the settings from `vercel.json` and the root `package.json`.
3.  Add the following **Environment Variables** in the Vercel dashboard:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
4.  Deploy!

## Project Structure
- `front/`: React + Vite frontend application.
- `package.json`: Root package file for command delegation.
- `vercel.json`: Vercel deployment configuration.
