# Directory Structure

## Project Metrics

**Files**: 22
**Total Lines**: 1370

## File Types

- .js: 1 files, 7 lines
- .ts: 15 files, 1042 lines
- .tsx: 6 files, 321 lines

## Project Tree

```
├── attached_assets
│   ├── Pasted--Your-goal-is-to-create-a-Replit-agent-that-builds-a-simple-React-application-with-the-following--1737392458803.txt
│   ├── Pasted-Okay-I-understand-A-complex-database-migration-state-requires-careful-consideration-Here-s-a-brea-1737403029047.txt
│   ├── Pasted-Okay-here-are-some-suggestions-for-cleaning-up-the-UI-along-with-explanations-and-prompts-you-can--1737401575353.txt
│   ├── Pasted-Okay-let-s-address-these-issues-one-by-one-We-need-to-figure-out-why-clicking-the-Create-Template-1737402963183.txt
│   ├── Pasted-Okay-let-s-outline-the-improvements-for-the-Replit-agent-to-implement-displaying-the-model-in-a-pi-1737401008207.txt
│   ├── Pasted-Okay-let-s-refine-the-categories-agent-model-types-roles-methodologies-and-default-instructions-1737396356775.txt
│   ├── Pasted-Okay-the-error-message-plugin-runtime-error-plugin-The-requested-module-src-lib-types-ts-does-1737402509670.txt
│   ├── Pasted-Okay-we-ve-gotten-past-the-onEdit-is-not-a-function-error-but-now-the-edit-functionality-and-templ-1737399909852.txt
│   ├── Pasted-Okay-we-ve-gotten-past-the-onEdit-is-not-a-function-error-but-now-the-edit-functionality-and-templ-1737399918092.txt
│   ├── Pasted-Subject-Resolving-onEdit-is-not-a-function-Error-and-Implementing-Template-Editing-in-TemplateLis-1737399661805.txt
│   ├── Pasted-We-need-to-add-a-new-top-level-category-for-meta-prompts-prompts-that-generate-other-prompts-Add-1737399483158.txt
│   ├── Pasted-We-need-to-modify-the-enhancement-prompts-to-prevent-the-Gemini-API-from-adding-extra-commentary-or--1737398275649.txt
│   ├── Pasted-We-need-to-modify-the-enhancement-prompts-to-prevent-the-Gemini-API-from-adding-extra-commentary-or--1737398403302.txt
│   ├── Pasted-You-re-absolutely-right-My-apologies-for-the-oversight-Removing-the-Agent-Enhanced-concept-was--1737400476377.txt
│   └── Pasted-You-re-right-if-the-enhanced-prompt-seems-to-be-completely-ignoring-the-original-prompt-s-content--1737400612351.txt
├── client
│   ├── index.html
│   └── src
│       ├── App.tsx
│       ├── hooks
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── index.css
│       ├── lib
│       │   ├── api.ts
│       │   ├── defaultPrompts.ts
│       │   ├── queryClient.ts
│       │   ├── storage.ts
│       │   ├── types.ts
│       │   └── utils.ts
│       ├── main.tsx
│       └── pages
│           ├── home.tsx
│           ├── not-found.tsx
│           └── templates.tsx
├── db
│   ├── index.ts
│   └── schema.ts
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── postcss.config.js
├── replit.nix
├── server
│   ├── index.ts
│   ├── routes.ts
│   └── vite.ts
├── tailwind.config.ts
├── theme.json
├── tsconfig.json
└── vite.config.ts
```


## Functions


### client/src/hooks/use-toast.ts

- dispatch
- genId
- toast
- useToast

### client/src/lib/api.ts

- createTemplate
- deleteTemplate
- enhancePrompt
- getTemplates
- updateTemplate

### client/src/lib/defaultPrompts.ts

- generateEnhancementPrompt
- getCustomPrompts
- resetToDefaultPrompts
- saveCustomPrompts

### client/src/lib/storage.ts

- clearApiKey
- getApiKey
- setApiKey

### client/src/lib/utils.ts

- cn
- decodePlaceholders
- encodePlaceholders
- extractPlaceholders
- preservePlaceholders

### db/index.ts

- validateConnection

### server/routes.ts

- registerRoutes

### server/vite.ts

- log
- serveStatic
- setupVite