# LogiScan AI

Automated Inventory Intelligence for High-Pressure Logistics

LogiScan AI is a mobile-first Progressive Web App (PWA) built to solve a specific operational bottleneck: the manual auditing of incoming inventory in high-volume residential and commercial environments.

I developed this system to replace a daily two-hour manual reconciliation process with a vision-driven workflow that runs in minutes.

## The Impact

**Time Saved:** Reduced a daily 120-minute manual audit to approximately 20 minutes.

**Accuracy:** 95% data reliability by implementing a custom vision-to-schema pipeline that filters out shipping noise to extract exact unit identifiers.

**Operational Visibility:** Transformed a "pen and paper" or manual spreadsheet task into a real-time, searchable PostgreSQL database.

## The Logic

### Computer Vision & Schema Adherence

Standard OCR often fails in messy environments. LogiScan uses GPT-4o Vision with a strict system prompt to analyze labels against a predefined data schema. The system is trained to ignore carrier-specific barcodes (FedEx/UPS) and focus exclusively on internal inventory stickers, ensuring only clean data enters the database.

### Atomic Data Integrity

Built on Supabase (PostgreSQL), the system utilizes composite keys to manage package data. This ensures that every scan is an atomic operation. If a package is scanned twice, the database performs an upsert, preventing duplicate entries and maintaining a single source of truth even during high-concurrency usage.

### Built for the "Field"

Logistics doesn't always happen next to a router. LogiScan is a PWA designed with a service worker architecture to ensure instant load times and functionality in storage rooms, basements, and loading docks where Wi-Fi is often spotty.

## Tech Stack

**Framework:** Next.js 15 (App Router)

**Intelligence:** OpenAI GPT-4o Vision

**Database:** Supabase / PostgreSQL

**Styling:** Tailwind CSS

## About the Project

This project was developed by Sergey Kudelin as part of a live research initiative to automate high-pressure operational environments. It is currently used as a field-tested solution to streamline inventory workflows.
