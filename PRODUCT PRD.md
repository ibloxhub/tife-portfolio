PROJECT_BLUEPRINT.md



---

SECTION 1 — AI EXECUTION INSTRUCTIONS

You are an AI development agent responsible for implementing the ShotThatWithTife Web Platform.

Execution Rules:

• Read the entire PROJECT_BLUEPRINT.md before starting any implementation
• Follow the architecture defined in this document strictly
• Do NOT introduce technologies outside the defined stack
• Do NOT modify database schemas without explicit instruction
• Follow backend-first development strategy strictly
• Implement development phases sequentially
• Complete every checklist before marking a phase complete
• Do not skip steps or improvise architecture


---

SECTION 2 — AI PROMPTING PROTOCOL

Execution pattern:

User Command → AI Action

Commands:

Start Phase X → Read phase
→ Create execution plan
→ Implement code
→ Complete checklist
→ Return walkthrough

Continue Phase X → Resume remaining tasks

Verify Phase X → Perform full code review using checklist


---

SECTION 3 — AI CODE REVIEW CHECKLIST

Architecture

• Folder structure respected
• Clear separation of concerns
• No business logic inside controllers

Code Quality

• No duplicated logic
• Meaningful naming
• Modular reusable functions

Security

• Input validation
• Authentication checks
• Safe database queries

Reliability

• Proper error handling
• Retry mechanisms where needed

Cleanliness

• No unused imports
• No debug logs left


---

SECTION 4 — PROJECT OVERVIEW

Project Name:

ShotThatWithTife Web Platform


---

Problem Statement:

Creative professionals struggle to:

Showcase their work in a high-converting way

Manage portfolio content easily

Track client interest and engagement

Handle inquiries efficiently


Most portfolio websites:

Are static

Lack analytics

Do not convert visitors into clients



---

Solution Summary:

A full-stack portfolio + CMS + analytics system that:

Showcases cinematic work beautifully

Converts visitors into paying clients

Tracks performance (projects, services, traffic)

Centralizes all operations in one admin dashboard



---

Core Value Proposition:

> A client acquisition system disguised as a portfolio website




---

Target Market:

Personal brands (creatives)

Videographers & photographers

Creative directors

Event stylists

Digital marketers



---

SECTION 5 — PRODUCT GOALS

Primary Goals

• Convert visitors into leads (high conversion UX)
• Provide full content control via admin dashboard
• Track performance (analytics + behavior tracking)
• Automate inquiry handling (email + WhatsApp)


---

Secondary Goals

• Build strong personal brand presence
• Improve SEO visibility
• Enable scalable content updates
• Provide data insights for decision-making


---

Non-Goals

• No multi-user SaaS system
• No payment processing system (v1)
• No complex booking calendar system
• No mobile app


---

SECTION 6 — TARGET USERS

User Personas

1. Admin (Primary User)

Owner (Tife)

Manages entire platform


2. Visitor (Client / Lead)

Potential client

Browses services & portfolio

Submits inquiries



---

Roles

Role	Description

Admin	Full control
Guest	Public user
System	Background processes



---

Permissions

Admin

• Full CRUD access
• View analytics
• Manage content
• View inquiries

Guest

• View pages
• Submit contact form
• Click CTAs


---

SECTION 7 — CORE FEATURES

System Capabilities

1. Portfolio Management


2. Services Management


3. Admin Dashboard


4. Custom Analytics Dashboard


5. Contact & Lead System


6. Email Notification System


7. WhatsApp Integration


8. Content Management System (CMS)


9. Authentication System


10. Media Upload System




---

SECTION 8 — FEATURE BREAKDOWN


---

1. Authentication

Admin login

Session management

Protected routes

Logout



---

2. Portfolio System

Add project

Edit project

Delete project

Upload images/videos

Categorize projects

Track views



---

3. Services System

Create services

Categorize services

Edit content

Track clicks



---

4. Contact System

Submit form

Store in database

Send admin email

Send user auto-reply

Tag by service



---

5. Analytics System

Google Analytics Data:

Visitors

Page views

Traffic sources


Custom Data:

Portfolio views

Service clicks

Leads



---

6. Email System

Admin notification emails

User auto-reply emails

Dynamic service-based messaging



---

7. WhatsApp Integration

Floating button

Pre-filled dynamic message

Service-specific messages



---

8. CMS System

Edit homepage content

Edit about page

Manage services

Manage portfolio



---

SECTION 9 — USER JOURNEYS


---

1. Visitor Journey (Conversion Flow)

1. Lands on homepage


2. Views services / portfolio


3. Clicks service


4. Opens contact form


5. Submits inquiry


6. Receives email


7. Clicks WhatsApp CTA




---

2. Admin Content Flow

1. Logs in


2. Opens dashboard


3. Adds/edits content


4. Publishes changes


5. Website updates instantly




---

3. Inquiry Handling Flow

1. User submits form


2. Data saved in Supabase


3. Email sent to admin


4. Auto-reply sent to user


5. Admin views in dashboard




---

4. Analytics Flow

1. Visitor interacts with site


2. Events tracked (custom + GA)


3. Data stored/fetched


4. Displayed in dashboard




---

SECTION 10 — SYSTEM ARCHITECTURE OVERVIEW


---

Architecture Type:

Modular Monolith (Next.js Full Stack)


---

High-Level Flow:

Frontend (Next.js UI)
        ↓
API Layer (Next.js API Routes)
        ↓
Service Layer (Business Logic)
        ↓
Supabase (Database + Auth + Storage)
        ↓
External Services:
- Google Analytics API
- Resend Email API


---

System Layers

1. Frontend Layer

UI components

Pages

User interactions



---

2. API Layer

Handles requests

Validates input

Calls services



---

3. Service Layer

Business logic

Data processing

Event tracking



---

4. Data Layer

Supabase PostgreSQL

File storage



---

5. External Integrations

Analytics

Email system



---

Data Flow Example

User submits form
   ↓
API Route
   ↓
Service Layer
   ↓
1. Save to DB
2. Send email
3. Track event
   ↓
Response → Frontend




---



SECTION 11 — TECHNOLOGY STACK

Frontend

Next.js (App Router)

React

Tailwind CSS

Framer Motion



---

Backend (Integrated via Next.js)

Next.js API Routes (server-side logic)

TypeScript



---

Database

Supabase (PostgreSQL)

Supabase Auth

Supabase Storage



---

Infrastructure

Vercel (hosting)

Supabase (backend services)



---

External Services

Google Analytics (traffic analytics)

Resend (email delivery)



---

SECTION 12 — PROJECT FOLDER STRUCTURE

/project-root

  /app
    /(public)
      /page.tsx
      /about/page.tsx
      /services/page.tsx
      /portfolio/page.tsx

    /(admin)
      /admin/login/page.tsx
      /admin/dashboard/page.tsx
      /admin/portfolio/page.tsx
      /admin/services/page.tsx
      /admin/analytics/page.tsx
      /admin/messages/page.tsx
      /admin/settings/page.tsx

    /api
      /auth/
      /portfolio/
      /services/
      /contact/
      /analytics/
      /upload/

  /components
    /ui
    /layout
    /sections
    /admin

  /lib
    /supabase
    /analytics
    /email
    /utils

  /hooks

  /types

  /styles

  /public

  /middleware.ts


---

SECTION 13 — DATABASE ARCHITECTURE

Type:

Relational database (PostgreSQL)


Strategy:

Normalized schema

Use foreign keys for relationships

JSON fields for flexible metadata



---

Key Principles:

Separate content from analytics

Track user behavior via events table

Use indexed queries for performance



---

SECTION 14 — DATA MODELS


---

1. Admin User (Handled by Supabase Auth)

Fields:

id

email

created_at



---

2. Portfolio

id
title
description
category (photo | video | event | marketing)
media_urls (json)
thumbnail_url
is_featured (boolean)
created_at
updated_at


---

3. Services

id
name
category
description
short_description
cta_text
created_at


---

4. Contacts (Leads)

id
name
email
message
service
status (new | read)
created_at


---

5. Events (Analytics)

id
event_type
page
metadata (json)
created_at

Examples:

portfolio_view

service_click

contact_submit



---

6. Settings

id
site_name
logo_url
social_links (json)
updated_at


---

SECTION 15 — DATABASE RELATIONSHIPS

Services → Contacts (1:N)
Portfolio → Events (1:N)
Services → Events (1:N)


---

Explanation:

One service → many inquiries

One portfolio item → many views

Events track all interactions



---

SECTION 16 — API ARCHITECTURE

Style:

RESTful API


Rules:

All endpoints under /api

JSON responses only

Server-side validation required

No direct DB calls from frontend



---

Authentication:

Supabase Auth (JWT-based)

Middleware protects /admin routes



---

SECTION 17 — API ENDPOINT DESIGN


---

Auth

POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session


---

Portfolio

GET    /api/portfolio
POST   /api/portfolio
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id


---

Services

GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id


---

Contact

POST /api/contact
GET  /api/contact
PUT  /api/contact/:id (mark as read)


---

Analytics

GET /api/analytics/overview
GET /api/analytics/events
POST /api/analytics/track


---

Upload

POST /api/upload


---

SECTION 18 — BACKEND MODULES


---

1. Auth Service

Login handling

Session validation



---

2. Portfolio Service

CRUD operations

Media handling

View tracking



---

3. Services Service

CRUD operations

Click tracking



---

4. Contact Service

Form handling

DB storage

Email triggering



---

5. Analytics Service

Fetch GA data

Fetch Supabase events

Combine results



---

6. Email Service

Send admin email

Send auto-reply

Dynamic content generation



---

7. Upload Service

File validation

Upload to Supabase storage



---

SECTION 19 — FRONTEND ARCHITECTURE


---

Structure:

Pages

Public pages

Admin pages



---

Layouts

Main layout (navbar + footer)

Admin layout (sidebar + dashboard UI)



---

Components

UI Components

Buttons

Cards

Inputs

Modals



---

Section Components

Hero

Services grid

Portfolio grid

Testimonials

CTA blocks



---

Admin Components

Tables

Forms

Charts

Cards



---

Hooks

useAuth

useFetch

useAnalytics

useForm



---

Services Layer (Frontend)

API calls

Data fetching



---

SECTION 20 — UI / UX DESIGN SYSTEM


---

Design Principles

Minimal

Cinematic

High contrast

Conversion-focused



---

Color System

Primary: #0B0B0B (black)

Secondary: #FFFFFF (white)

Accent: #C9A96E (gold)

Neutral: grays



---

Typography

Headings: Playfair Display / Syne

Body: Inter / Poppins



---

Spacing Scale

4 / 8 / 16 / 24 / 32 / 48 / 64 px



---

Components

Buttons

Primary (filled)

Secondary (outline)



---

Cards

Soft shadow

Rounded corners



---

Inputs

Minimal

Focus states



---

Animations

Fade-in

Hover zoom

Smooth transitions



---

UX Rules

Clear CTA every 2 sections

Mobile-first design

Fast loading (optimize media)

No clutter



---

SECTION 21 — STATE MANAGEMENT


---

Approach:

1. React Query (Server State)

Fetch API data

Cache responses

Handle loading states



---

2. Local State (React)

Form state

UI interactions



---

3. Context API

Auth state

Global settings



---

Rules:

No unnecessary global state

Keep state close to usage

Avoid prop drilling





---




SECTION 22 — BACKGROUND WORKERS

Even though we’re using a serverless setup, we still simulate “background jobs” via async flows.


---

1. Email Worker

Purpose:

Send emails without blocking the main request.

Trigger:

Contact form submission


Tasks:

Send admin notification email

Send user auto-reply email



---

2. Analytics Worker

Purpose:

Track user behavior

Trigger:

Page visit

Portfolio click

Service click

Contact submission



---

Execution Pattern:

API Route → Trigger async function → store event / send email


---

Future Upgrade (Optional):

Queue system (not required for v1)



---

SECTION 23 — THIRD PARTY INTEGRATIONS


---

Core Integrations:

Supabase

Google Analytics

Resend



---

Optional Enhancements:

WhatsApp deep linking (no API needed)

Email client (Gmail notifications)



---

SECTION 24 — SECURITY ARCHITECTURE


---

Authentication

Supabase Auth (email/password)

JWT session handling



---

Authorization

Admin-only route protection

Middleware checks



---

Data Protection

Input validation (server-side)

Sanitization of user input



---

File Security

Restrict file types (images/videos only)

Limit file size



---

Rate Limiting

Prevent spam form submissions



---

Environment Variables

Store API keys securely

Never expose secrets to frontend



---

SECTION 25 — ERROR HANDLING STRATEGY


---

API Error Format

{
  "success": false,
  "message": "Error description"
}


---

Error Types

Validation Errors

Missing fields

Invalid email



---

Server Errors

Database failure

API failure



---

Strategy

Always return meaningful messages

Log errors internally

Never expose sensitive info



---

SECTION 26 — LOGGING & OBSERVABILITY


---

Logging

API requests

Errors

Critical actions (login, delete)



---

Metrics

Number of requests

Error rate

Response time



---

Monitoring Tools

Vercel logs

Supabase logs



---

Alerts

Email failure alerts

API failure logs



---

SECTION 27 — TESTING STRATEGY


---

Unit Tests

Services logic

Utility functions



---

Integration Tests

API endpoints

Database operations



---

End-to-End Tests

Contact form flow

Admin dashboard flow



---

Manual Testing

Mobile responsiveness

Cross-browser testing



---

SECTION 28 — DEVELOPMENT RULES


---

Coding Standards

Use service layer (NO logic in API routes)

Modular reusable functions

Clear naming conventions

Type safety (TypeScript)



---

Best Practices

Keep components small

Avoid duplication

Write clean, readable code



---

SECTION 29 — BACKEND-FIRST DEVELOPMENT STRATEGY


---

Build Order:

1. Database schema
2. Backend services
3. API endpoints
4. Frontend logic
5. UI components
6. Integration
7. Testing
8. Deployment


---

Rule:

Frontend MUST NOT be built before backend is stable.


