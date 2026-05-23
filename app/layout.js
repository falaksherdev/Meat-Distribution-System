import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Meet Management System",
  description: "Qurbani Ghost Distribution System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
