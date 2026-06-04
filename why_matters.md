# Why These Choices Matter

This document explains the reasoning behind the main technology and architecture choices in ZennVid.

## 1. Next.js Over Plain React

Next.js was chosen instead of plain React because the product needed more than a client-side UI.

- It gives routing, layouts, and page structure out of the box
- It supports SEO-friendly rendering, which matters for a product platform
- It makes it easier to build a full web app instead of wiring everything manually
- It fits better with production deployment and future scaling

Plain React is good for the view layer, but Next.js gives the full application framework needed for a product like this.

## 2. Deep Frontend Choices

### Bun Over npm

Bun was preferred over npm for faster installs, faster local workflow, and a smoother developer experience.

### React Query Over Manually Configured APIs

React Query was used to manage server state instead of manually handling every API call and cache update.

- It reduces boilerplate
- It handles caching, refetching, and loading states more cleanly
- It keeps frontend data flow more maintainable

### TypeScript Over JavaScript

TypeScript was used to make the codebase safer and easier to maintain.

- It catches many errors before runtime
- It improves editor support and refactoring
- It helps keep a larger codebase consistent over time

### Axios Over Fetch

Axios was chosen for cleaner request handling.

- It has a better API for common client patterns
- It supports interceptors more naturally
- It simplifies request and response handling across the app

### Motion For Animations And Modular Architecture

Motion was used to keep animations expressive but controlled.

- It improves the feel of the interface without adding unnecessary complexity
- It works well for modern UI transitions
- It supports cleaner component-level animation structure

## 3. Express Over Other Backend Frameworks

Express was chosen because it is lightweight, flexible, and easy to control.

- It gives direct control over routing and middleware
- It works well for custom API workflows
- It keeps the backend simple when the project does not need a heavier framework

For this platform, Express was a practical choice because the backend needed to be custom rather than opinionated.

## 4. Deep Backend Choices

### Long HTTP Requests Over Background Jobs For Video Generation

At the earliest stage, video generation could be handled directly through HTTP while the system was still small.

This was useful for proving the core flow before adding more infrastructure.

### BullMQ And Redis Over Other Queue Options

BullMQ with Redis was selected for background jobs because it is reliable and well suited for async workloads.

- It handles long-running tasks better than blocking HTTP
- It gives queue visibility and job control
- It fits the video generation pipeline well

### Cloudflare R2 Over AWS S3 And Cloudinary

Cloudflare R2 was chosen for storage because it is simple, practical, and cost-aware.

- It works well for file storage without unnecessary complexity
- It avoids some of the extra overhead of larger media platforms
- It fits the platform better than adding a heavier media service layer

### SSE For Live Progress Instead Of WebSockets

SSE was used to stream progress updates from the backend to the frontend.

- It is simpler than WebSockets for one-way progress updates
- It is a better fit for job status streaming
- It reduces implementation overhead while still giving real-time feedback

### Webhooks For Razorpay Payment And Order Flow

Webhooks were chosen over simple API callback handling because payment confirmation must be trusted and server-side.

- They provide a more reliable payment state transition
- They help keep order and credit updates secure
- They reduce the risk of relying only on the client flow

### Access Token And Refresh Token Auth Over Simple JWT

A secure access-token and refresh-token strategy was used instead of a single simple JWT approach.

- It improves security
- It supports cleaner session renewal
- It is better for real production auth flows

## 5. AI Pipeline Choices

### Groq For Text Generation Over Other Providers Like OpenRouter

Groq was selected for text generation because of fast response time and a clean developer experience.

### Groq LLM With OpenAI/GPT-OSS-20B Over Other Models

The model choice was made to balance capability, speed, and practical usage for the product flow.

### Edge-TTS For Voice Over Other TTS Options

Edge-TTS was used for voice generation because it is straightforward and efficient for the pipeline.

### Cloudflare Worker With Free Model For Image Generation

Image generation used a Cloudflare Worker with a free model to keep the workflow lightweight and reduce infrastructure cost.

### AssemblyAI For Transcript Generation Over Whisper

AssemblyAI was used for transcript generation because it is easier to integrate into a product pipeline than managing a local speech model.

### XTTS-V2.0.2 By Coqui For Voice Clone

XTTS-V2.0.2 was chosen for voice cloning because it is a strong fit for high-quality cloned voice output.

### LTX-2 Audio-to-Video For Lip Sync

LTX-2 Audio-to-Video was used for lip sync because it fits the output quality needed better than older alternatives like SadTalker in this product context.

### FFmpeg For Video Processing

FFmpeg was used for processing and combining video assets because it is the standard tool for reliable media processing.

## 6. MongoDB Over PostgreSQL

MongoDB was chosen over PostgreSQL because the platform benefits from flexible, document-oriented data handling.

- It fits content-heavy and evolving product data well
- It is convenient for storing nested application records
- It makes iteration faster when the schema changes often

For this project, MongoDB matched the shape of the product data better than a rigid relational setup.

## Summary

These choices were not about using the most popular tools by default.

They were chosen to keep the platform:

- Easier to build
- Easier to deploy
- Easier to scale where needed
- More stable for production use
- Better aligned with the product goals of ZennVid
