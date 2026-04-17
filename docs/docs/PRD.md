# Product Requirement Document (PRD): Co-Reply

## 1. Product Concept
**"Co-Reply: An AI-Human Synergetic SNS Engagement Assistant"**

Co-Reply is a semi-automated marketing platform designed to streamline the "Search, Think, and Write" process of SNS engagement. It avoids the risks of automated spam by providing high-quality AI drafts that humans finalize and send, ensuring authentic and safe interactions for brand building.

## 2. Core Objectives
- **Efficiency:** Reduce the cognitive load of finding targets and drafting personalized replies.
- **Safety:** Eliminate account suspension risks by utilizing "Human-in-the-loop" via X Web Intent.
- **Global Reach:** Native support for both English and Japanese markets with a refined, bilingual UI.

## 3. Targeted Features (MVP Scope)

### A. Target Scout (Data Acquisition)
- **Function:** Periodically fetch posts from X (Twitter) based on specific keywords or hashtags.
- **Requirements:**
    - Support for multi-language search queries (EN/JP).
    - Store fetched posts in Supabase with unique constraints to prevent duplicates.
    - Configurable search frequency and volume to respect API rate limits.

### B. AI Draft Engine (LLM Integration)
- **Function:** Generate context-aware reply drafts using the Gemini API.
- **Requirements:**
    - **Persona Injection:** Users can define their "Brand Persona" and "Goal" (e.g., Lead Gen, Community Building, Support).
    - **Language Detection:** Automatically reply in the language of the original post (EN or JP).
    - **Quality Control:** System prompts optimized to sound human, empathetic, and non-intrusive.

### C. Refined Dashboard (User Experience)
- **Function:** A minimalist interface to review, edit, and send replies.
- **Requirements:**
    - **Clean Bilingual UI:** A sophisticated, minimal design supporting seamless EN/JP switching.
    - **Status Management:** Track posts through "Pending," "Approved (Sent)," and "Skipped" states.
    - **One-Click Delivery:** Open the X Web Intent (`https://twitter.com/intent/tweet`) with pre-filled text upon approval.
    - **Responsive Design:** Optimized for both desktop and mobile "vibe coding" sessions.

## 4. Technical Stack
- **Framework:** Next.js 15+ (App Router)
- **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Provider:** Google Gemini API (via Google AI SDK)
- **Styling:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide-react
- **Localization:** i18next or Next.js Internationalization (Routing-based)

## 5. Implementation Guidelines
- **Internal Documentation:** While the PRD is in English for AI efficiency, all code comments, README files, and commit messages must be written in **Japanese**.
- **Data Abstraction:** Design the database schema to be platform-agnostic to support future integrations (e.g., LinkedIn, Bluesky).
- **Design Language:** Adhere to a "Minimalist & Dark-first" aesthetic with high-quality typography.

## 6. Database Schema Overview (Initial)
- `projects`: Stores user personas, search keywords, and target goals.
- `posts`: Stores raw data fetched from SNS (content, author, platform_id).
- `drafts`: Stores AI-generated reply suggestions linked to `posts`.