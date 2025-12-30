# Next Pro

**Next Pro** is a modern, full-stack blog platform designed for performance, scalability, and a seamless user experience. Built with **Next.js 16** and **Convex**, it offers real-time capabilities and a robust foundation for content creation and interaction.

## ✨ Key Features

- **📝 Rich Content Management**: Effortlessly create and manage blog posts with integrated image support.
- **⚡ Real-Time Interaction**: Experience instant updates for posts and comments, powered by Convex's real-time database.
- **🔍 Smart Search**: Built-in full-text search to quickly find relevant content.
- **💬 Engaging Community**: Foster community with a responsive commenting system.
- **🔐 Secure Authentication**: Reliable user authentication provided by Better Auth.
- **🎨 Modern & Responsive Design**: A polished UI built with **Tailwind CSS v4** and **Shadcn UI** for a consistent experience across devices.

## 🛠️ Tech Stack

This project leverages a cutting-edge technology stack:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Convex](https://www.convex.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **State Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [HugeIcons](https://hugeicons.com/)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (preferred package manager)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/BhushanLagare7/next-pro.git
    cd next-pro
    ```

2.  **Install dependencies**

    ```bash
    pnpm install
    ```

3.  **Setup Environment**

    Initialize the Convex backend. This will prompt you to log in and configure your project credentials automatically in `.env.local`.

    ```bash
    npx convex dev
    ```

### Running the Application

1.  **Start the development server**

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

2.  **Explore the app**

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 📂 Project Structure

A quick overview of the top-level directory structure:

- `app/`: Next.js App Router pages, layouts, and route handlers.
- `components/`: Reusable UI components, including Shadcn UI elements.
- `convex/`: Backend logic, database schema, and API functions.
- `lib/`: Shared utility functions and configuration files.
- `public/`: Static assets like images and fonts.

## 🤝 Contributing

We welcome contributions to Next Pro!

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 🆘 Support

If you encounter any issues or have questions, please:

- Check the [Issues](https://github.com/BhushanLagare7/next-pro/issues) page.
- Review the [Convex Documentation](https://docs.convex.dev/) for backend-related queries.
- Refer to the [Next.js Documentation](https://nextjs.org/docs) for framework specifics.
