# 🧠 AI Platform – Legal, Resume, and Data Chat Assistant

All-in-one AI Platform that allows users to:
- 📄 Analyze legal documents (contracts, NDAs, etc.)
- 📑 Analyze resumes and suggest job matches
- 📊 Chat with uploaded CSV data like a data analyst

Built with:
- **Frontend**: Next.js 14 (in `web/`)
- **Backend**: FastAPI with OpenRouter API (in `service/`)
- **Free AI API**: [OpenRouter](https://openrouter.ai)

---

## 📁 Folder Structure
```
AI-PLATFORM
├── service
│   ├── .gitignore
│   ├── docker-compose.yaml
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── src
│       ├── application
│       │   └── use_cases
│       │       └── file_upload_use_case.py
│       ├── entities
│       │   └── file_analysis.py
│       ├── infrastructure
│       │   ├── config.py
│       │   ├── dependencies.py
│       │   └── services
│       │       ├── ai_service_impl.py
│       │       └── file_service_impl.py
│       ├── presentation
│       │   └── api
│       │       └── v1
│       │           └── file_routes.py
│       └── services
│           ├── ai_service.py
│           └── file_service.py
└── web
    ├── .gitignore
    ├── app
    │   ├── api
    │   │   ├── auth
    │   │   │   └── [...nextauth]
    │   │   │       └── route.ts
    │   │   ├── data-chat
    │   │   │   └── route.ts
    │   │   └── legal-chat
    │   │       └── route.ts
    │   ├── auth
    │   │   └── signin
    │   │       ├── loading.tsx
    │   │       └── page.tsx
    │   ├── chat-with-data
    │   │   └── page.tsx
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── legal-analyzer
    │   │   └── page.tsx
    │   ├── page.tsx
    │   └── resume-analyzer
    │       └── page.tsx
    ├── components
    │   ├── auth-provider.tsx
    │   ├── protected-route.tsx
    │   ├── theme-provider.tsx
    │   ├── ui
    │   │   ├── accordion.tsx
    │   │   ├── alert-dialog.tsx
    │   │   ├── alert.tsx
    │   │   ├── aspect-ratio.tsx
    │   │   ├── avatar.tsx
    │   │   ├── badge.tsx
    │   │   ├── breadcrumb.tsx
    │   │   ├── button.tsx
    │   │   ├── calendar.tsx
    │   │   ├── card.tsx
    │   │   ├── carousel.tsx
    │   │   ├── chart.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── collapsible.tsx
    │   │   ├── command.tsx
    │   │   ├── context-menu.tsx
    │   │   ├── dialog.tsx
    │   │   ├── drawer.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── hover-card.tsx
    │   │   ├── input-otp.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── menubar.tsx
    │   │   ├── navigation-menu.tsx
    │   │   ├── pagination.tsx
    │   │   ├── popover.tsx
    │   │   ├── progress.tsx
    │   │   ├── radio-group.tsx
    │   │   ├── resizable.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── select.tsx
    │   │   ├── separator.tsx
    │   │   ├── sheet.tsx
    │   │   ├── sidebar.tsx
    │   │   ├── skeleton.tsx
    │   │   ├── slider.tsx
    │   │   ├── sonner.tsx
    │   │   ├── switch.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── textarea.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   ├── toggle-group.tsx
    │   │   ├── toggle.tsx
    │   │   ├── tooltip.tsx
    │   │   ├── use-mobile.tsx
    │   │   └── use-toast.ts
    │   └── user-nav.tsx
    ├── components.json
    ├── hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib
    │   └── utils.ts
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── public
    │   ├── placeholder-logo.png
    │   ├── placeholder-logo.svg
    │   ├── placeholder-user.jpg
    │   ├── placeholder.jpg
    │   └── placeholder.svg
    ├── styles
    │   └── globals.css
    ├── tailwind.config.ts
    └── tsconfig.json