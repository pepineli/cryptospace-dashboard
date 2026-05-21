# CryptoSpace Dashboard

A modern, real-time cryptocurrency dashboard built with Angular 18+ and the CoinGecko API. Track prices, market caps, and historical data with interactive charts.

## Live Demo

[https://pepineli.github.io/cryptospace-dashboard/](https://pepineli.github.io/cryptospace-dashboard/)

## Features

- Real-time cryptocurrency data - Top 100 cryptocurrencies by market cap
- Price charts - 7-day historical price charts with Chart.js
- Search and Filter - Find any cryptocurrency by name or symbol
- Sorting - Sort by price, 24h change, market cap, or rank
- Responsive design - Works on desktop, tablet, and mobile
- Dark theme - Space-inspired gradient background with clean UI
- BRL currency - All prices displayed in Brazilian Real

## Technologies

| Technology | Purpose |
|------------|---------|
| Angular 18+ | Front-end framework |
| TypeScript | Type-safe JavaScript |
| Chart.js | Interactive price charts |
| CoinGecko API | Cryptocurrency data |
| GitHub Pages | Hosting |

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI

```bash
npm install -g @angular/cli
```

### Clone the repository

```bash
git clone https://github.com/pepineli/cryptospace-dashboard.git
cd cryptospace-dashboard
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
ng serve --open
```

The application will open at `http://localhost:4200`

### Build for production

```bash
ng build --configuration production --base-href "https://pepineli.github.io/cryptospace-dashboard/"
```

## Project Structure

```
cryptospace-dashboard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.ts
│   │   │       ├── dashboard.component.html
│   │   │       └── dashboard.component.css
│   │   ├── services/
│   │   │   └── api.service.ts
│   │   ├── models/
│   │   │   └── crypto.model.ts
│   │   └── app.component.ts
│   ├── index.html
│   └── styles.css
├── angular.json
├── package.json
└── README.md
```

## API Integration

This dashboard uses the CoinGecko API (free tier) to fetch:
- Current prices in BRL
- 24h price changes
- Market cap rankings
- 7-day historical price data for charts

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| /coins/markets | Get current cryptocurrency data |
| /coins/{id}/market_chart | Get historical price data for charts |

## Customization

### Change currency

Edit `currency` variable in `dashboard.component.ts`:

```typescript
currency: string = 'brl';
```

Change to 'usd', 'eur', etc.

### Change number of cryptocurrencies per page

Modify the `perPage` variable in `dashboard.component.ts`:

```typescript
perPage: number = 20;
```

Change to 50, 100, etc.

### Styling

All styles are in `src/styles.css` with CSS variables and modern design principles.

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment:

1. Build the project:

```bash
ng build --configuration production --base-href "https://pepineli.github.io/cryptospace-dashboard/"
```

2. Copy contents of `dist/dashboard-angular/browser` to `docs/` folder
3. Push to GitHub
4. Enable GitHub Pages in repository settings (branch: main, folder: /docs)

## Performance Optimizations

- Lazy loading for routes
- ChangeDetectionStrategy.OnPush
- Production build optimizations
- Chart.js lazy initialization

## Known Issues

- CoinGecko API has a rate limit of 30 requests per minute
- First load may be slower due to API response time
- Charts require stable internet connection

## Future Improvements

- Add more timeframes (30 days, 1 year)
- Compare multiple cryptocurrencies
- Price alerts
- Portfolio tracking
- WebSocket support for real-time updates
- PWA support

## Author

**Murilo Pepineli**

- GitHub: [@pepineli](https://github.com/pepineli)
- LinkedIn: [Murilo Pepineli](https://linkedin.com/in/murilo-pepineli)
- Email: murilo.pepineli.br@outlook.com.br

## License

This project is open source and available under the MIT License.

## Acknowledgments

- CoinGecko for providing the cryptocurrency API
- Chart.js for the charting library
- Google Fonts for Space Grotesk, Inter, and JetBrains Mono fonts

## How to Use

1. Open the live demo
2. Browse the list of top cryptocurrencies
3. Use the search bar to find specific coins
4. Click on any card to see detailed information
5. Sort by price, change, market cap, or rank
6. Change the number of items displayed (20/50/100)
