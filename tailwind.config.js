/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        '7': '7 7 0%',
        '17': '17 17 0%',
      },
      colors: {
        'background-default-hover': '#f5f6f6',
        'conversation-panel-background': '#efeae2',
        'app-background-stripe': '#00a884',
        'app-background': '#eae6df',
        'incoming-background': '#fff',
        'outgoing-background': '#d9fdd3',
        'panel-header-background': '#f0f2f5',
        'primary-strong': '#111b21',
        'panel-header-icon': '#54656f',
        'rich-text-panel-background': '#f0f2f5',
        'bubble-meta': '#667781',
        'system-message-background': 'hsla(0,0%,100%,0.95)',
        'system-message-text': '#54656f',
      },
      backgroundImage: {
        'chat-img': "url('/assets/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')"
      },
      'boxShadow': {
        'message': '0 1px .5px rgba(#0b141a,.13)'
      }
    },
  },
  plugins: [],
}
