
/**
 * Routes structure documentation
 * 
 * Main Routes:
 * 
 * / - Public Routes:
 *   / - Home page
 *   /sobre - About page
 *   /como-funciona - How it works page
 *   /faq - FAQ page
 *   /feedback - Feedback page
 *   /tutoriais - Tutorials page
 *   /auth - Authentication page (login/signup)
 * 
 * /cliente/* - Client Routes (for "participante" user type):
 *   / - Client dashboard
 *   /missoes - Missions page
 *   /perfil - Client profile page
 *   /sorteios - Raffles page
 *   /indicacoes - Referrals page
 *   /cashback - Cashback marketplace
 *   /suporte - Support page
 *   /tour - Tour/onboarding page
 *   /como-funciona - How it works page (client specific)
 *   /faq - FAQ page (client specific)
 * 
 * /anunciante/* - Advertiser Routes (for "anunciante" user type):
 *   / - Advertiser dashboard
 *   /campanhas - Campaigns listing page
 *   /nova-campanha - New campaign creation page
 *   /moderacao - Content moderation page
 *   /analises - Analytics page
 *   /creditos - Credits management page
 *   /notificacoes - Notifications page
 *   /perfil - Advertiser profile page
 *   /configuracoes - Settings page
 * 
 * /admin/* - Admin Routes (for "admin" user type):
 *   / - Admin dashboard
 *   /usuarios - User management page
 *   /sorteios - Lottery management page
 *   /relatorios - Reports page

 *   /notificacoes - Notifications page
 *   /regras - Rules configuration page
 *   /configuracoes - Settings page
 */

export * from "./AppRoutes";
export * from "./PublicRoutes";
export * from "./ClientRoutes";
export * from "./AdvertiserRoutes";
export * from "./AdminRoutes";
