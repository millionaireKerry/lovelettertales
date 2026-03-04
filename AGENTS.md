# Mission Control Agent Instructions

This repository is part of a multi-site content automation system managed by a central Mission Control.

## Repository Purpose

- **Site:** lovelettertales.com
- **Domain:** lovelettertales.com
- **Niche:** Romantic stories and letters

This repository contains the source code for the website hosted at the domain above. The content is automatically generated and published by AI agents.

## Automation Workflow

1.  **Trigger:** The workflow is triggered on a schedule defined in `.github/workflows/main.yml`.
2.  **Agent Execution:** A central orchestrator script calls the appropriate content generation agent (`blog_writer` or `social_media_creator`).
3.  **Content Generation:** The agent uses AI to generate a new blog post or social media content relevant to the site's niche.
4.  **Formatting & Commit:**
    - For static HTML sites, the agent formats the content into a new `.html` file, updates the `sitemap.xml`, and commits the changes to this repository.
    - For database-backed sites, the agent calls a secure API endpoint to create the new content in the database.
5.  **Deployment:** Pushing a commit to the `main` branch automatically triggers a deployment on the hosting platform (e.g., GitHub Pages, Vercel, Manus).

## How to Interact

- **Manual Tasks:** To trigger a task manually, use the Mission Control Dashboard or send a specially formatted email to the supervisor agent.
- **Modifications:** Do not edit the scheduled workflow file (`.github/workflows/main.yml`) directly. All configuration is managed centrally in the Mission Control `config.yaml` file.
- **Content Issues:** If you notice issues with the generated content, please flag it in the main Mission Control repository, not here.
