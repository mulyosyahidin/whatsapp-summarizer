# WA Grab - AI-Powered Chat Application

A modern, full-stack web application built with Laravel 13, React 19, and advanced AI capabilities. WA Grab is a sophisticated chat platform that integrates artificial intelligence for message summarization and intelligent assistance.

## Features

### 🤖 AI-Powered Capabilities
- **Chat Assistant**: AI-powered conversational agent for intelligent responses
- **Message Summarization**: Automatic summarization of chat conversations using advanced AI models
- **Multi-Provider AI Integration**: Support for multiple AI providers including OpenAI, Gemini, Anthropic, Cohere, Azure OpenAI, and more
- **Flexible Model Configuration**: Easy switching between different AI models and providers

### 💬 Chat Features
- Real-time chat messaging
- File sharing and attachment support
- Chat archiving
- Message history and search
- Chat summaries for quick reference
- Ephemeral message expiration

### 🔐 Security & Authentication
- User authentication with Laravel Fortify
- API authentication with Laravel Sanctum
- Secure password handling
- User profile management

### 🎨 Modern Frontend
- React 19 with TypeScript
- Inertia.js for seamless server-side rendering
- Tailwind CSS for styling
- Headless UI components (Radix UI)
- Fully responsive design

### 🛠 Development Tools
- Laravel Telescope for debugging
- Laravel Pail for log monitoring
- ESLint & Prettier for code quality
- Pest PHP for testing
- PHPUnit test framework

## Tech Stack

### Backend
- **PHP**: 8.3
- **Laravel**: 13.7
- **Database**: MySQL/PostgreSQL
- **Laravel Packages**:
  - Laravel AI (v0.6.6) - AI Integration
  - Laravel Fortify (v1.34) - Authentication
  - Laravel Sanctum (v4) - API Authentication
  - Laravel Telescope (v5.20) - Debugging
  - Laravel Wayfinder (v0.1.14) - Frontend Routing
  - Laravel Boost (v2.2) - Development Enhancement
  - Laravel Pail (v1.2.5) - Log Monitoring

### Frontend
- **React**: 19
- **TypeScript**: Latest
- **Inertia.js**: 3
- **Tailwind CSS**: 4
- **Vite**: Build tool
- **Radix UI**: Component library
- **Headless UI**: 2.2.0

### Development & Testing
- **Testing**: Pest (v4.7), PHPUnit (v12)
- **Code Quality**: Pint (v1.27), ESLint (v9), Prettier (v3)
- **Containerization**: Docker & Docker Compose

## Prerequisites

- PHP 8.3+
- Node.js 18+
- Composer
- Docker & Docker Compose (optional)
- MySQL or PostgreSQL

## Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd wa-grab
composer install
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

Configure your AI providers in `.env`:
```env
# AI Provider Configuration
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_anthropic_key
# ... other provider keys

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wa_grab
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Database Setup
```bash
php artisan migrate
php artisan db:seed
```

### 4. Build Assets
```bash
npm run build
```

## Development

### Quick Start
```bash
composer run dev
```

This will start:
- Laravel development server
- Queue listener
- Vite development server with hot module replacement

### Individual Commands
```bash
# Start Laravel server
php artisan serve

# Watch frontend assets
npm run dev

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Run queue worker
php artisan queue:listen

# View logs in real-time
php artisan pail
```

### Code Quality
```bash
# Format code
composer run lint
npm run format

# Check code style
composer run lint:check
npm run lint:check
npm run format:check
npm run types:check

# Run all CI checks
composer run ci:check
```

## Testing

### Run All Tests
```bash
composer test
```

### Run Specific Tests
```bash
# Feature tests
php artisan test --filter=feature

# Unit tests
php artisan test --filter=unit

# Watch tests
php artisan test --watch
```

## Docker Development

### Using Docker Compose
```bash
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
docker-compose -f docker-compose.dev.yml exec app php artisan migrate

# Build frontend
docker-compose -f docker-compose.dev.yml exec app npm run build
```

## Project Structure

### Backend (`app/`)
- **Actions/**: Fortify authentication actions
- **Ai/Agents/**: AI agent implementations
- **Http/**: Controllers, middleware, requests, resources
- **Jobs/**: Queue jobs for async tasks
  - `SummarizeChat.php` - Chat summarization job
  - `SyncChatMessages.php` - Message synchronization
- **Models/**: Eloquent models
  - `Chat.php` - Chat conversations
  - `ChatMessage.php` - Individual messages
  - `ChatFile.php` - File attachments
  - `ChatSummary.php` - Chat summaries
  - `AiChatMessage.php` - AI message logs
  - `AiLog.php` - AI operation logs
  - `User.php` - User model
  - `Contact.php` - Contact model
- **Services/**: Business logic
  - `ChatService.php` - Chat operations
  - `SummarizationService.php` - AI summarization
- **Providers/**: Service providers
- **Concerns/**: Reusable traits

### Frontend (`resources/`)
- **js/**: React components and pages
- **css/**: Styling with Tailwind CSS
- **views/**: Blade templates

### Configuration (`config/`)
- **ai.php**: AI provider configuration
- **app.php**: Application settings
- **auth.php**: Authentication settings
- **database.php**: Database configuration
- **fortify.php**: Fortify settings
- **inertia.php**: Inertia.js configuration
- **mail.php**: Email configuration
- **telescope.php**: Telescope debugging
- **wag.php**: WAG-specific settings

## Configuration

### AI Providers
Configure AI providers in `config/ai.php`. The application supports:
- OpenRouter
- Gemini
- OpenAI
- Anthropic
- Cohere
- Azure OpenAI
- AWS Bedrock

### Default Models
Set default models for different AI tasks:
```php
'default' => 'openrouter',
'default_for_images' => 'gemini',
'default_for_audio' => 'openai',
'default_for_transcription' => 'openai',
'default_for_embeddings' => 'openai',
```

## Debugging

### Laravel Telescope
Access Telescope at `/telescope` for debugging info about:
- Database queries
- HTTP requests
- Cache operations
- Jobs and queues
- Events

### Logs
```bash
# View logs in real-time
php artisan pail

# With filtering
php artisan pail --type=error
```

## API Documentation

The application provides API endpoints authenticated with Sanctum tokens:
- Chat management
- Message operations
- File uploads
- AI agent operations

See `routes/api.php` for complete API routes.

## Performance & Scaling

- Message summarization runs asynchronously via queues
- Caching strategy for AI embeddings
- Database indexing for chat queries
- ESR-ready with Inertia.js

## Contributing

1. Follow the Laravel Boost guidelines in `GEMINI.md`
2. Maintain code style consistency
3. Write tests for new features
4. Run CI checks before committing

```bash
composer run ci:check
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check existing documentation
2. Review Telescope debug info
3. Check application logs with Pail
4. Review test cases for usage examples

## Roadmap

- [ ] Enhanced AI model selection UI
- [ ] Advanced chat analytics
- [ ] Real-time collaboration features
- [ ] Mobile application
- [ ] Advanced security features

---

**Built with ❤️ using Laravel 13 and React 19**