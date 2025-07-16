/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#364152',
        lightGray: '#54647E',
        selectionGray: '#8CA7D0',
        geminderBlue: '#0057FF',

      }
    },
  },
  plugins: [],
}

