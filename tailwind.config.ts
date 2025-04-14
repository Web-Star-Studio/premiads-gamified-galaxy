import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// PremiAds theme colors
				neon: {
					cyan: '#00FFE7',
					pink: '#FF00C8',
					lime: '#b4f10a'
				},
				galaxy: {
					dark: '#0A0A18',
					purple: '#9b87f5',
					deepPurple: '#1A1F2C',
					lightPurple: '#D6BCFA',
					magenta: '#D946EF',
					blue: '#1EAEDB'
				}
			},
			fontFamily: {
				orbitron: ['Orbitron', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'pulse-neon': {
					'0%, 100%': { boxShadow: '0 0 10px 0 rgba(0, 255, 231, 0.8)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(0, 255, 231, 0.5)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'particles': {
					'0%': { transform: 'translateY(0) translateX(0) rotate(0)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100px) translateX(100px) rotate(360deg)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-in-out',
				'fade-out': 'fade-out 0.6s ease-in-out',
				'slide-up': 'slide-up 0.6s ease-out',
				'slide-down': 'slide-down 0.6s ease-out',
				'scale-in': 'scale-in 0.6s ease-out',
				'pulse-neon': 'pulse-neon 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'particles': 'particles 8s ease-in-out infinite'
			},
			backgroundImage: {
				'galaxy-gradient': 'linear-gradient(to right, rgba(10, 10, 24, 0.9), rgba(26, 31, 44, 0.9))',
				'neon-gradient': 'linear-gradient(to right, #00FFE7, #FF00C8, #b4f10a)',
				'purple-glow': 'radial-gradient(circle, rgba(155, 135, 245, 0.3) 0%, rgba(26, 31, 44, 0) 70%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
