import type { Config } from "tailwindcss";
import animatePlugin from 'tailwindcss-animate'
import scrollbarPlugin from 'tailwind-scrollbar'

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
				// Updated color palette
				neon: {
					cyan: '#2F80ED',
					pink: '#FF4ECD',
					lime: '#00C48C',
					red: '#FF5252'
				},
				galaxy: {
					dark: '#0A0B14',
					purple: '#9B53FF',
					deepPurple: '#1A1F30',
					lightPurple: '#D6BCFA',
					magenta: '#FF4ECD',
					blue: '#2F80ED'
				},
				// PremiAds brand colors
				premiads: {
					purple: '#4400b9',
					orange: '#fe690d'
				}
			},
			fontFamily: {
				'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', "Noto Sans", 'sans-serif', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
				'heading': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system'],
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
					'0%, 100%': { boxShadow: '0 0 10px 0 rgba(47, 128, 237, 0.8)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(47, 128, 237, 0.5)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'particles': {
					'0%': { transform: 'translateY(0) translateX(0) rotate(0)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100px) translateX(100px) rotate(360deg)', opacity: '0' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px 0 rgba(47, 128, 237, 0.5)' },
					'50%': { boxShadow: '0 0 20px 5px rgba(47, 128, 237, 0.8)' }
				},
				'pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-500px 0' },
					'100%': { backgroundPosition: '500px 0' }
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
				'particles': 'particles 8s ease-in-out infinite',
				'glow': 'glow 2s infinite',
				'pulse': 'pulse 2s infinite',
				'shimmer': 'shimmer 2s infinite linear'
			},
			backgroundImage: {
				'galaxy-gradient': 'linear-gradient(to right, rgba(10, 11, 20, 0.9), rgba(26, 31, 48, 0.9))',
				'neon-gradient': 'linear-gradient(to right, #2F80ED, #FF4ECD, #00C48C)',
				'purple-glow': 'radial-gradient(circle, rgba(155, 83, 255, 0.3) 0%, rgba(26, 31, 48, 0) 70%)',
				'blue-purple-gradient': 'linear-gradient(135deg, #2F80ED 0%, #9B53FF 100%)',
				'pink-purple-gradient': 'linear-gradient(135deg, #FF4ECD 0%, #9B53FF 100%)',
				'green-blue-gradient': 'linear-gradient(135deg, #00C48C 0%, #2F80ED 100%)',
			}
		}
	},
	plugins: [animatePlugin, scrollbarPlugin],
} satisfies Config;
