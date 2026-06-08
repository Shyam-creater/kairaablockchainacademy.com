
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "headingFont":['Nunito Sans', 'sans-serif'],
        "paraFont":['Nunito Sans', 'sans-serif'],
        "custom1": ['Nunito Sans', 'sans-serif'], 
        // "headingFont":["Platypi", "serif"],
        "poppins":["Poppins", "sans-serif"],
        "josefin":["Josefin Sans", "sans-serif"],
      }
    },
    screens:{
      xs:"480px",
      sm:"768px",
      md:"1060px",
      "1000px":"1000px",
      "1100px":"1100px",
      "1200px":"1200px",
      "1300px":"1300px",
      "1500px":"1500px",
      "800px":"800px",
      "400px":"400px",
    },

    animation: {
      spin: 'spin 6s linear infinite',
      shake:' shake   10s  infinite',

      wiggle: 'wiggle 0.5s ease-in-out infinite',
      bounce: 'bounce 0.5s ease-in-out infinite',

      wave: 'wave 1s ease-in-out infinite',

      fadeInUp: 'fadeInUp 1s ease-out',
      fadeInRight: 'fadeInRight 1s ease-out',
      fadeInLeft: 'fadeInLeft 1s ease-out',

      rotateAndSlideIn: 'rotateAndSlideIn 1s ease-out forwards',
      zoomIn: 'zoomIn 3s ease-out forwards',

      slideInLeft: 'slideInLeft 0.5s ease-out forwards',

      fadeIn: 'fadeIn 1s ease-in forwards',

      pulse: 'pulse 1s infinite',

      // waterpaint: 'waterpaint 4s linear infinite',
      // TypeWritter Effect
      typing: 'typing 3.5s steps(40, end) forwards',
      blinkCaret: 'blinkCaret 0.75s step-end infinite',


      
    },
    keyframes: {





      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },

     
      shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-10px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateY(10px)' },
      },

      wiggle: {
        '0%, 100%': { transform: 'rotate(-3deg)' },
        '50%': { transform: 'rotate(3deg)' },
      },
      bounce: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
     
      wave: {
        '0%, 100%': { transform: 'translateX(0)' },
        '50%': { transform: 'translateX(10px)' },
      },


      fadeInUp: {
        '0%': { opacity: 0, transform: 'translateY(200px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },

      fadeInRight: {
        '0%': { opacity: 0, transform: 'translateX(200px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },

      fadeInLeft: {
        '100%': { opacity: 0, transform: 'translateX(200px)' },
        '0%': { opacity: 1, transform: 'translateX(0)' },
      },


      rotateAndSlideIn: {
        '0%': { opacity: 0, transform: 'translateY(50px) rotate(-10deg)' },
        '100%': { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
      },

      zoomIn: {
        '0%': { opacity: 0, transform: 'scale(0.8)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },

      slideInLeft: {
        '0%': { opacity: 0, transform: 'translateX(-100px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },

      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },


      pulse: {
        '0%, 100%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
      },


     

// Typewritter Effect

typing: {
  'from': { width: '0' },
  'to': { width: '100%' },
},
blinkCaret: {
  'from, to': { borderColor: 'transparent' },
  '50%': { borderColor: 'orange' },
},


    },

  },
  variants:{},
  plugins: [],
}
// "paraFont":["Anek Devanagari", "sans-serif"],


