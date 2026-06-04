# System History

This document describes how ZennVid evolved over time, from the first working prototype to the current production-ready platform.

## Version 1 - Initial Build

The first version was a straightforward full-stack setup:

- Frontend built with Next.js
- Backend built with Express
- AI model and AI video generation pipeline implemented in Python

At this stage, the goal was to prove the core product flow: user interaction on the web, API handling on the server, and video generation through the Python-based AI layer.

## Version 2 - Local AI Model Pipeline

The next phase added a proper local AI pipeline for video generation and media processing.

- SadTalker for lip sync
- XTTS for voice cloning
- Whisper for subtitle generation
- Edge-TTS for voice generation
- Gemini for image generation

This version made the AI layer more complete by handling the core generation steps locally before moving to a more production-friendly setup later.

## Version 3 - Feature Expansion

The third version added the first major product features:

- Admin panel for platform management
- OpenAPI support for clearer API integration
- Payment flow with a credit-based system
- Feed and community video sharing
- Anime Twin feature to find the best matching anime using the user's face

This version shifted the project from a simple demo into a more feature-rich platform.

## Version 4 - Deployment Simplification

Deploying Python with a local model became difficult and less practical for production.

To solve that, the AI workflow was moved to Hugging Face Spaces.

This reduced deployment complexity and made the AI layer easier to host and scale.

At this stage, some generation services were also swapped for more practical production alternatives:

- LTX-2 Audio-to-Video for lip sync instead of the earlier local setup
- AssemblyAI for subtitle generation instead of Whisper hosting locally
- Cloudflare Worker-based image generation instead of gemini limited model
- Cloudinary for storage while the platform was still transitioning toward a better storage layer

## Version 5 - Backend Simplification

After Hugging Face was adopted, Python was no longer needed as a separate service because it was only used for API calling.

So the extra Python hop was removed and the backend directly handled the requests through Express.

This made the system simpler, faster, and easier to maintain.

## Version 6 - UI Redesign

The whole user interface was redesigned to look more realistic and product-focused.

The goal of this stage was to move away from an experimental look and make the platform feel like a polished commercial product.

## Version 7 - Backend Depth and Reliability

The backend was improved in several important ways:

- Redis was introduced as the BullMQ backend for reliable job processing
- Large video generation requests were moved to BullMQ background jobs instead of blocking HTTP requests
- Server-Sent Events were added so the frontend could receive live progress updates
- The auth flow was upgraded from basic JWT handling to a secure access-token and refresh-token strategy
- Rate limiting was added to protect the system
- Cloudflare R2 replaced Cloudinary for storage, with private and public buckets, CDN-optimized delivery, and global cache support
- Code was refactored to make the backend structure more proper and maintainable

This version focused on stability, scalability, and cleaner backend architecture.

## Version 8 - Feature Pruning

Unnecessary features that were not stable or not essential for the platform were removed:

- Admin panel
- Anime Twin
- OpenAPI surface

This helped reduce complexity and keep the product focused on the strongest core use cases.

## Version 9 - Final Line

The final version completed the platform with the production essentials:

- Webhook integration
- Live Razorpay payment flow
- Sitemap for better SEO
- Favicon and metadata enhancements for a stronger web presence
- Frontend deployment on Vercel
- Backend deployment on Railway

## Current System Shape

The current architecture is centered around a clean separation of responsibilities:

- Next.js for the frontend
- Express for the backend API layer
- Redis + BullMQ for asynchronous job processing
- SSE for real-time generation progress and credit synchronization
- Hugging Face-based AI integration where needed
- Cloudflare R2 for storage and delivery
- Razorpay for payments and credits
- Vercel for frontend hosting
- Railway for backend hosting

## Summary

ZennVid evolved in stages:

1. Prototype the core AI video flow
2. Add a local AI generation pipeline
3. Add product features and monetization
4. Simplify deployment
5. Remove unnecessary service layers
6. Improve UI and backend reliability
7. Prune unstable features
8. Launch as a focused production platform

Each version reduced friction, improved maintainability, or moved the product closer to a stable real-world deployment.
