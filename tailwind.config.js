/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   board: {
      //     bg: "#212731",
      //     surface: "#131c2e",
      //     card: "#1e2d3d",
      //     cardHover: "#1a2535",
      //     border: "#1e2d3d",
      //     borderHover: "#2d3f55",
      //     input: "#0f172a",
      //     inputBorder: "#334155",
      //     modal: "#1e2433",
      //     modalBorder: "#2d3748",
      //   },
      //   text: {
      //     primary: "#f1f5f9",
      //     secondary: "#94a3b8",
      //     muted: "#64748b",
      //     faint: "#7e8590",
      //   },
      //   accent: {
      //     indigo: "#6366f1",
      //     indigoHover: "#4f46e5",
      //   },
      //   status: {
      //     backlog: "#6366f1",
      //     progress: "#f59e0b",
      //     done: "#22c55e",
      //   },
      //   priority: {
      //     lowBg: "#166534",
      //     lowText: "#4ade80",
      //     medBg: "#92400e",
      //     medText: "#fbbf24",
      //     highBg: "#7f1d1d",
      //     highText: "#f87171",
      //   },
      // },
      colors: {
        board: {
          bg: "#fafbff",        // blue board background
          surface: "#EBECF0",   // column background
          card: "#FFFFFF",      // task card
          cardHover: "#F4F5F7",
          border: "#D1D5DB",

          input: "#FFFFFF",
          inputBorder: "#CBD5E1",

          modal: "#FFFFFF",
          modalBorder: "#E5E7EB",
        },

        text: {
          primary: "#172B4D",
          secondary: "#5E6C84",
          muted: "#6B7280",
        },

        // accent: {
        //   blue: "#0C66E4",
        //   blueHover: "#0052CC",
        // },

        // status: {
        //   backlog: "#94A3B8",
        //   progress: "#F59E0B",
        //   done: "#22C55E",
        // },

        accent: {
          indigo: "#6366f1",
          indigoHover: "#4f46e5",
        },
        
        // status: {
        //   backlog: "#6366f1",
        //   progress: "#f59e0b",
        //   done: "#22c55e",
        // },

        priority: {
          lowBg: "#DCFCE7",
          lowText: "#166534",

          medBg: "#FEF3C7",
          medText: "#92400E",

          highBg: "#FEE2E2",
          highText: "#991B1B",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(20px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.2s ease",
        fadeIn: "fadeIn 0.15s ease",
      },
    },
  },
  plugins: [],
};
