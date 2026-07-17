# Privacy Policy

**Effective Date:** July 6, 2026

This Privacy Policy explains how **Folio** ("we", "our", or "the App"), a local-first Markdown and slide editing application developed by **Lemonslice Studios**, collects, uses, and protects your information.

Folio is designed with "Quiet Tech" principles: it is local-first, offline-capable, and respects your digital privacy. **We do not run backend servers, we do not collect any personal data, and we do not use tracking or analytics tools.**

---

## 1. Core Architecture & Local-First Data Storage
By default, all data you input into Folio stays completely on your local device. 
* **Documents and Themes:** Your Markdown files, custom slides, and configured layouts are stored locally in your browser's IndexedDB (using `lightning-fs`). 
* **User Preferences:** Any application settings or local configurations are stored locally in browser-level preferences.
* **No Server Intermediary:** We do not host your documents, and we do not have access to your local storage or files.

---

## 2. Google Drive Synchronization (Optional)
Folio offers an optional cloud synchronization feature to sync your files across devices. If you choose to connect your Google Account:

* **Authorization and Scopes:** Folio requests access using the `https://www.googleapis.com/auth/drive.file` OAuth 2.0 scope. This is a restricted, privacy-focused scope that only grants Folio the ability to create, read, and write files that *this specific application* creates or that you explicitly open with it. Folio cannot access or view any other files in your Google Drive.
* **Direct Browser-to-Google Communication:** All authentication and API requests are executed client-side directly within your web browser. No files, metadata, or authentication credentials are ever sent to Lemonslice Studios, or any third-party server.
* **Token Management:** Your Google OAuth 2.0 access tokens are held temporarily in your browser's active memory (RAM) to perform the API requests. They are cleared when you log out, close the tab, or reload the application.

---

## 3. Google Gemini AI Integration (Optional)
Folio includes an optional AI-powered editing assistant using Google Gemini models:

* **Bring Your Own Key (BYOK):** To use this feature, you must provide your own Gemini API key obtained via Google AI Studio.
* **Key and Request Storage:** Your API key is stored locally on your device in IndexedDB. When you request an AI operation (such as rewriting or summarizing text), the App communicates directly with Google's Generative Language API (`generativelanguage.googleapis.com`).
* **Privacy:** Your API keys, prompts, and generated content are never sent to Lemonslice Studios. They are subject to Google's terms and privacy policies for the Generative Language API.

---

## 4. Third-Party Services
Because Folio is a Progressive Web App (PWA) that integrates optional external services, your interactions with those services are governed by their respective privacy policies:
* **Google Identity Services & Google Drive:** [Google Privacy Policy](https://policies.google.com/privacy)
* **Google Gemini API:** [Google Privacy Policy](https://policies.google.com/privacy)

The app itself (interface, fonts, and icons) is fully self-hosted and makes no requests to third-party servers. One exception: a few of the optional bundled slide themes (e.g. *marpx*, *hobbes*) load their display fonts from Google Fonts when a presentation using them is rendered. If you do not use those themes, no such request is made.

---

## 5. Security of Your Data
Since Folio stores all data on your local device or syncs it directly to your personal Google Drive:
* You are solely responsible for securing your physical device, browser environment, and Google Account credentials.
* We recommend locking your device and using secure browser instances to prevent unauthorized local access to your data.

---

## 6. Children's Privacy
Folio does not collect, store, or process any personal data. It is safe for use by individuals of all ages.

---

## 7. Changes to this Privacy Policy
We may update this Privacy Policy from time to time. Any changes will be reflected by updating this document within the public Git repository. Your continued use of the App after updates are published constitutes your acceptance of the revised policy.

---

## 8. Contact & Support
If you have any questions or concerns about this Privacy Policy or Folio's privacy practices, please contact us by opening an issue on our GitHub repository:
* **GitHub Repository:** [https://github.com/lemonslice-studios/folio](https://github.com/lemonslice-studios/folio)
