# 🐔 Tax Chicken: a Vibe Coded Tax Return Assistant

A modern web application to help organize and prepare tax documents efficiently with style and personality.

## Features

- **Document Upload**: Upload PDF, image, and text files for tax documents
- **AI Analysis**: Powered by OpenAI GPT to analyze and extract key information from documents
- **Vibe-Coded Experience**: Built with personality and style
- **Document Tracking**: Keep track of all your tax documents with status indicators
- **Category Organization**: Organize documents by Income, Deductions, and Business categories
- **Progress Monitoring**: Visual progress tracking for document completion
- **Tax Return Generation**: AI-powered tax return summary generation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tax Tips**: Built-in guidance and tips for tax preparation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Deployment

Tax Chicken is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## License

MIT License