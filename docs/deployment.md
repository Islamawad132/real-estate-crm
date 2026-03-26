# Production Deployment Guide

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- A server with at least 2 GB RAM and 10 GB disk
- PostgreSQL 16 (included in Docker Compose, or use a managed service)
- Authme IAM server ([setup guide](authme-setup.md))
- Domain name pointed to your server (optional, for HTTPS)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Islamawad132/real-estate-crm.git
cd real-estate-crm

# 2. Configure environment
cp .env.example .env
# Edit .env with your production values (database password, Authme secrets, etc.)

# 3. Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh deploy
```

The application will be available at:

| URL | Service |
|-----|---------|
| `http://your-server/admin` | Admin Portal |
| `http://your-server/agent` | Agent Portal |
| `http://your-server/api/docs` | Swagger API Docs |
| `http://your-server/api/health` | Health Check |

## Architecture

```
                    +-------------------+
                    |    Nginx :80      |
                    +--------+----------+
                             |
             +---------------+---------------+
             |               |               |
      /admin/*        /agent/*         /api/*
             |               |               |
    +--------+------+ +------+-------+ +-----+------+
    |  Admin UI     | |  Agent UI    | |  NestJS    |
    |  (static)     | |  (static)    | |  :3000     |
    +---------------+ +--------------+ +-----+------+
                                             |
                                      +------+------+
                                      | PostgreSQL  |
                                      |   :5432     |
                                      +-------------+
```

## Docker Image Build

The Dockerfile uses a multi-stage build for an optimized production image:

1. **deps** -- Install backend Node.js dependencies
2. **admin-deps** -- Install Admin Portal dependencies
3. **agent-deps** -- Install Agent Portal dependencies
4. **build** -- Build Admin UI, Agent UI, generate Prisma client, build NestJS, copy UI assets into `dist/`
5. **production** -- Minimal runtime with only production dependencies, runs as non-root `node` user

```bash
# Build the production image
docker build -t real-estate-crm:latest .

# With a version tag
docker build -t real-estate-crm:1.0.0 .
```

## Environment Variables

Copy `.env.example` and configure for production:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://crm_user:STRONG_PW@db:5432/real_estate_crm` |
| `AUTHME_URL` | Authme IAM server URL | `https://auth.example.com` |
| `AUTHME_REALM` | Authme realm | `real-estate` |
| `AUTHME_CLIENT_ID` | Authme client ID | `crm-backend` |
| `AUTHME_CLIENT_SECRET` | Authme client secret | `<secret>` |
| `ADMIN_PORTAL_URL` | Admin UI URL (for CORS) | `https://crm.example.com/admin` |
| `AGENT_PORTAL_URL` | Agent UI URL (for CORS) | `https://crm.example.com/agent` |
| `PORT` | Backend port | `3000` |
| `NODE_ENV` | Must be `production` | `production` |
| `UPLOAD_DIR` | File upload directory | `/app/uploads` |

## Deploy Script Commands

```bash
# Full deploy (backup DB, build images, migrate, start)
./scripts/deploy.sh deploy

# Check service status and health
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Backup database
./scripts/deploy.sh backup

# Rollback
./scripts/deploy.sh rollback

# Clean up old Docker images
./scripts/deploy.sh cleanup
```

## Database Migrations

Migrations run automatically during deploy. To run them manually:

```bash
# Inside Docker
docker compose exec app npx prisma migrate deploy

# Or with a standalone container
docker run --rm \
  -e DATABASE_URL="postgresql://crm_user:PW@db-host:5432/real_estate_crm" \
  real-estate-crm:latest \
  npx prisma migrate deploy
```

To seed the database (first deployment only):

```bash
docker compose exec app npx ts-node prisma/seed.ts
```

## HTTPS / TLS

For production HTTPS, you have two options:

### Option A: Reverse proxy in front (recommended)

Place Cloudflare, AWS ALB, or another TLS-terminating proxy in front of this stack. The Nginx container listens on port 80; your upstream proxy handles TLS.

### Option B: Certbot with Nginx

1. Mount a certificates volume in `docker-compose.yml`
2. Add an SSL server block in `nginx/nginx.conf`
3. Use Certbot to obtain and renew certificates

Sample Nginx SSL block:

```nginx
server {
    listen 443 ssl http2;
    server_name crm.yourdomain.com;

    ssl_certificate     /etc/ssl/certs/crm.crt;
    ssl_certificate_key /etc/ssl/private/crm.key;

    location /api/ {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }

    location / {
        proxy_pass http://app:3000;
    }
}
```

## Backup Strategy

### Database Backups

```bash
# Manual backup
docker compose exec db pg_dump -U postgres real_estate_crm > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20260326.sql | docker compose exec -T db psql -U postgres real_estate_crm

# Automated daily backups (add to crontab)
# 0 2 * * * cd /path/to/real-estate-crm && ./scripts/deploy.sh backup
```

### File Uploads

The uploads volume should be backed up regularly:

```bash
docker run --rm -v crm_uploads:/data -v $(pwd):/backup alpine \
  tar czf /backup/uploads_backup_$(date +%Y%m%d).tar.gz /data
```

## Monitoring

### Health Check

The `/api/health` endpoint returns:

```json
{
  "status": "ok",
  "timestamp": "2026-03-26T00:00:00.000Z",
  "uptime": 12345.67,
  "database": "connected",
  "version": "0.0.1"
}
```

### Docker Health Checks

Both the `app` and `db` services have built-in Docker health checks:

```bash
docker compose ps
```

### Recommended Monitoring Stack

| Aspect | Tool |
|--------|------|
| Application metrics | Prometheus + Grafana |
| Error tracking | Sentry |
| Log aggregation | Structured JSON logs (Pino) via ELK or Loki |
| Uptime monitoring | UptimeRobot / Pingdom |
| Database monitoring | pgAdmin / pg_stat_statements |

## CI/CD Pipeline

The project includes GitHub Actions (`.github/workflows/ci.yml`) that run on every push/PR to `main`:

1. **Backend** -- Lint, type-check, unit tests (with PostgreSQL service), build
2. **Admin UI** -- Lint, type-check, build
3. **Agent UI** -- Lint, type-check, build
4. **Mobile (Flutter)** -- Analyze, test
5. **Docker Build** -- Verify the production image builds successfully

To add automated deployment, extend the CI pipeline with a deploy job that runs after the Docker build succeeds.

## Troubleshooting

**Container won't start:**
```bash
docker compose logs app
docker compose logs db
```

**Database connection issues:**
```bash
docker compose exec db pg_isready -U postgres
```

**CORS errors in the browser:**
Ensure `ADMIN_PORTAL_URL` and `AGENT_PORTAL_URL` match the exact origins the portals are served from (include protocol, host, and port if non-standard).

**JWT validation failures:**
1. Confirm the Authme JWKS endpoint is accessible: `{AUTHME_URL}/realms/{AUTHME_REALM}/protocol/openid-connect/certs`
2. Verify `AUTHME_REALM` and `AUTHME_CLIENT_ID` match the Authme configuration
3. Check that the token has not expired

**Rebuild from scratch:**
```bash
docker compose down -v   # WARNING: deletes database volume
docker compose up -d --build
```
