# Cloud Gear Frontend

Angular frontend for Cloud-Gear.com - Multi-product cloud services platform.

## Features
- Responsive Angular Material UI
- User authentication
- Compute resource management
- Real-time pricing estimates

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Running
```bash
npm start
```

The application will start on `http://localhost:4200`

### Development Server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Configuration
- Backend API URL: Configured in `src/environments/environment.ts`
- JWT storage: LocalStorage with configurable key

## Project Structure
- `src/app/components/` - Reusable components
- `src/app/services/` - API services
- `src/app/interceptors/` - HTTP interceptors
- `src/app/models/` - TypeScript interfaces

## Development
- Angular 18
- Angular Material for UI components
- RxJS for reactive programming
- TypeScript for type safety