# Cloudflare Tunnel for MinIO

This project can expose the MinIO S3 API through a remotely managed Cloudflare Tunnel. The backend continues to use the private MinIO endpoint for storage
operations and uses the public HTTPS endpoint only when signing browser-facing upload, download, and preview URLs.

## 1. Create the tunnel route

In the Cloudflare dashboard:

1. Go to **Networking > Tunnels** and create a Cloudflare Tunnel.
2. Add a **Published application** route with a dedicated hostname, such as `storage.example.com`.
3. Set its service URL to `http://minio:9000`.
4. Leave **HTTP Host Header** empty. Overriding it changes a signed part of the S3 request and causes `SignatureDoesNotMatch` responses.
5. Copy the tunnel token from the Docker connector command.

Create a Cloudflare Cache Rule for this hostname with **Cache eligibility** set to **Bypass cache**. 
This keeps every presigned GET authenticated by MinIO and prevents an edge-cached object from outliving its URL signature.

The route must use the root of a dedicated hostname. Do not publish MinIO below a path such as `https://example.com/minio`; S3 request signing does not support rewriting the API behind a subpath.

Do not put a Cloudflare Access login policy in front of this hostname. A client using a presigned URL can authenticate to MinIO with the URL signature, but it cannot complete an additional Access login flow. 
Use short URL expirations and Cloudflare WAF/rate-limit rules when additional protection is needed.

The MinIO Console on port `9001` is intentionally not published. If remote console access is required, give it a different hostname and protect that hostname with Cloudflare Access.

## 2. Configure the project

Set these values in the root `.env` file:

```dotenv
# The backend is running on the host. If it is later moved into Compose, use http://minio:9000 instead.
MINIO_ENDPOINT=http://localhost:9000

# Must exactly match the public hostname configured in Cloudflare. Do not add a
# path or a trailing slash.
MINIO_PUBLIC_ENDPOINT=https://storage.example.com

# Set the actual frontend origin. Multiple origins are comma-separated.
MINIO_CORS_ALLOW_ORIGIN=http://localhost:5173,https://app.example.com

CLOUDFLARE_TUNNEL_TOKEN=<token copied from Cloudflare>
```

Keep `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY` equal to the credentials used by the MinIO container. Never commit the root `.env` file or the tunnel token.

The hostname and scheme are part of an S3 v4 signature. If `MINIO_PUBLIC_ENDPOINT` differs from the hostname used by the browser, MinIO will reject the request with `SignatureDoesNotMatch`. 
URLs issued before an endpoint or credential change will also stop working.

## 3. Start MinIO and the tunnel

```powershell
docker compose --profile cloudflare up -d minio cloudflared
docker compose logs -f cloudflared
```

The `cloudflare` profile keeps the tunnel disabled during ordinary local development. MinIO remains available locally at `http://localhost:9000`, 
while Cloudflare sends public HTTPS requests to `http://minio:9000` over the Compose network.

Restart the Spring Boot server after changing `MINIO_PUBLIC_ENDPOINT`; it builds the signing client at application startup.

## 4. Verify

1. Open `https://storage.example.com/minio/health/live`. A healthy MinIO server returns HTTP 200.
2. Request an upload URL from `GET /api/v1/medias/upload/presigned?filename=test.txt` and confirm its host is `storage.example.com`.
3. Upload the raw file body to that URL with HTTP `PUT`.
4. Request a download or preview URL and open it from a device outside the local network.

If a browser preflight fails, confirm `MINIO_CORS_ALLOW_ORIGIN` contains the frontend's exact origin (scheme, host, and port), then restart MinIO.

## Cloudflare limits

Cloudflare applies request-size and connection-time limits to proxied traffic. At the time this configuration was added, the maximum upload size is 100 MB on Free and Pro plans and 200 MB on Business. 
Keep application upload limits at or below the Cloudflare plan limit, or use a non-proxied/object-storage endpoint for larger files.
