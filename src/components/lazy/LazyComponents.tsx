
import { lazy } from 'react';

// Client components
export const LazyClientDashboard = lazy(() => import('@/pages/ClientDashboard'));
export const LazyClientMissions = lazy(() => import('@/pages/ClientMissions'));
export const LazyClientProfile = lazy(() => import('@/pages/ClientProfile'));
export const LazyClientRaffles = lazy(() => import('@/pages/ClientRaffles'));
export const LazyClientReferrals = lazy(() => import('@/pages/ClientReferrals'));

// Admin components
export const LazyAdminPanel = lazy(() => import('@/pages/AdminPanel'));
export const LazyUserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
export const LazyLotteryManagementPage = lazy(() => import('@/pages/admin/LotteryManagementPage'));
export const LazyDocumentationPage = lazy(() => import('@/pages/admin/DocumentationPage'));
export const LazyModerationPage = lazy(() => import('@/pages/admin/ModerationPage'));
export const LazyNotificationsPage = lazy(() => import('@/pages/admin/NotificationsPage'));
export const LazyRulesPage = lazy(() => import('@/pages/admin/RulesPage'));
export const LazySettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

// Advertiser components
export const LazyAdvertiserDashboard = lazy(() => import('@/pages/AdvertiserDashboard'));
export const LazyAdvertiserProfile = lazy(() => import('@/pages/AdvertiserProfile'));
export const LazyAdvertiserCampaigns = lazy(() => import('@/pages/advertiser/AdvertiserCampaigns'));
export const LazyNewCampaign = lazy(() => import('@/pages/advertiser/NewCampaign'));
export const LazyAnalyticsPage = lazy(() => import('@/pages/advertiser/AnalyticsPage'));
export const LazyCreditsPage = lazy(() => import('@/pages/advertiser/CreditsPage'));
export const LazyCrmPage = lazy(() => import('@/pages/advertiser/CrmPage'));
export const LazyAdvertiserModerationPage = lazy(() => import('@/pages/advertiser/ModerationPage'));
export const LazyAdvertiserNotificationsPage = lazy(() => import('@/pages/advertiser/NotificationsPage'));
export const LazyAdvertiserSettingsPage = lazy(() => import('@/pages/advertiser/SettingsPage'));
export const LazyProfilePage = lazy(() => import('@/pages/advertiser/ProfilePage'));
export const LazyPaymentSuccessPage = lazy(() => import('@/pages/advertiser/PaymentSuccessPage'));
export const LazyCouponValidationPage = lazy(() => import('@/pages/advertiser/CouponValidationPage'));

// Dashboard components - placeholders that return null for now
export const LazyMissionsCarousel = lazy(() => Promise.resolve({ default: () => null }));
export const LazyActiveMissions = lazy(() => Promise.resolve({ default: () => null }));

// Cashback component - create a simple wrapper
export const LazyCashbackForm = lazy(() => Promise.resolve({ default: () => null }));

// Public pages
export const LazyBlog = lazy(() => import('@/pages/Blog'));
export const LazyBlogPost = lazy(() => import('@/pages/BlogPost'));
export const LazySupport = lazy(() => import('@/pages/Support'));
export const LazyTutorials = lazy(() => import('@/pages/Tutorials'));
export const LazyFeedback = lazy(() => import('@/pages/Feedback'));
export const LazyTour = lazy(() => import('@/pages/Tour'));
export const LazyTeam = lazy(() => import('@/pages/Team'));
export const LazyCareers = lazy(() => import('@/pages/Careers'));

// Legal pages
export const LazyTermsOfUse = lazy(() => import('@/pages/legal/TermsOfUse'));
export const LazyPrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
export const LazyCookiesPolicy = lazy(() => import('@/pages/legal/CookiesPolicy'));

// Features
export const LazyCashbackMarketplace = lazy(() => import('@/pages/CashbackMarketplace'));
