# 🚀 DevFlows

> A real-time collaborative developer workspace designed to bring communication, collaboration, and visual thinking into one platform.

DevFlows is a full-stack collaborative workspace where developers can communicate with their team, create conversations, and work together on a real-time collaborative canvas.

The project was built to explore how real-time applications work internally — from authentication and WebSocket communication to synchronized canvas state, room management, message delivery, and collaborative editing.

---

## 🌐 Overview

Modern development often requires switching between multiple applications for communication, brainstorming, documentation, and collaboration.

DevFlows aims to bring these workflows together into a single workspace.

The platform provides:

- 💬 Real-time one-to-one and group communication
- 🎨 Collaborative canvas for visual brainstorming
- 🔄 Real-time synchronization between users
- 👥 Online user presence
- 🔔 Real-time notifications
- 🧠 Persistent conversations and canvas data
- 🔐 Authentication and protected application routes
- 📄 Multiple canvas pages
- ↩️ Shape manipulation and synchronization
- 🏠 Centralized dashboard for managing the workspace

The main focus of the project is **real-time collaboration and scalable application architecture**.

---

# ✨ Features

## 🔐 Authentication

DevFlows provides an authentication system for users.

Users can:

- Create an account
- Sign in
- Access protected dashboard routes
- Maintain an authenticated session
- Access conversations and collaborative rooms based on their account

Protected routes prevent unauthenticated users from accessing the main workspace.

---

# 💬 Real-Time Chat

DevFlows includes a real-time communication system.

Users can:

- Send direct messages
- Participate in group conversations
- Receive messages instantly
- See conversation updates in real time
- Track unread messages
- See the latest conversation preview
- Receive typing indicators
- Receive real-time conversation creation events
- Handle deleted messages/events

Messages are delivered through a persistent WebSocket connection.

---

# 🎨 Collaborative Canvas

DevFlows includes a real-time collaborative canvas that allows multiple users to work together in the same workspace. Users can create, edit, move, and delete shapes, while changes are synchronized with other users through WebSockets.

Key Features:
- Real-time collaboration — Canvas changes are instantly synchronized between connected users.
- Multiple canvas pages — Users can work with shapes organized across different pages.
- Drawing tools — Supports rectangles, circles, lines, arrows, pencil drawings, and text.
- Shape manipulation — Select, move, update, and delete individual shapes.
- Real-time shape synchronization — New, updated, and deleted shapes are broadcast to users in the same canvas room.
- Implemented server-side authorization and shape ownership, preventing users from modifying or deleting shapes owned by other users.
- Canvas rooms — Users join a specific canvas room and only receive updates related to that workspace.
- Online presence — Displays users currently active in a canvas room.
- Persistent canvas data — Shapes are stored in the database and restored when users join the canvas.
- Page-based synchronization — Shapes are maintained separately for each canvas page.
- Event-driven architecture — CanvasStore manages local canvas state, while CanvasSyncManager handles synchronization between the store and WebSocket server.

---

# 🧠 Second Brain

Second Brain is a personal knowledge management application designed to help users save, organize, and revisit useful digital content in one centralized workspace. The application allows users to collect content such as YouTube videos and Twitter/X posts, making it easier to build a personal knowledge library instead of losing valuable information across different platforms.

Key Features:
- Save useful content — Store YouTube videos and Twitter/X posts for future reference.
- Centralized knowledge library — Keep saved resources organized in one place.
- Dashboard — View and manage saved content through a dedicated dashboard.
- Content organization — Manage collected resources based on their type and purpose.
- Easy access — Quickly revisit previously saved resources whenever needed.
- Personal knowledge base — Build a long-term collection of useful learning and development resources.