/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          cyan: '#00C7D4',
          red: '#E43921',
          blue: '#017CEE',
          green: '#00AD46',
          gray: '#51504F',
        },
        // Secondary Colors
        secondary: {
          cyan: '#11E1EE',
          orange: '#FF7557',
          blue: '#0CB6FF',
          green: '#04D659',
          gray: '#CBCBCB',
        },
        // 기존 airflow 컬러를 새 팔레트로 매핑 (호환성을 위해)
        airflow: {
          blue: '#017CEE', // Primary Blue
          navy: '#51504F', // Primary Gray (다크)
          green: '#00AD46', // Primary Green
          orange: '#FF7557', // Secondary Orange
          cyan: '#00C7D4', // Primary Cyan (새로운 메인 컬러)
        },
      },
    },
  },
  plugins: [],
};
