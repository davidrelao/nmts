const config = {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            glow: 'hsl(var(--primary-glow))',
          },
          secondary: 'hsl(var(--secondary))',
          accent: 'hsl(var(--accent))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
        },
        backgroundImage: {
          'gradient-primary': 'var(--gradient-primary)',
          'gradient-heritage': 'var(--gradient-heritage)',
          'gradient-subtle': 'var(--gradient-subtle)',
        },
        boxShadow: {
          museum: 'var(--shadow-museum)',
          heritage: 'var(--shadow-heritage)',
        },
        transitionTimingFunction: {
          elegant: 'var(--transition-elegant)',
        },
      },
    },
    plugins: [],
  }
  
  export default config