

import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"


// Pages d'authentification
import AuthLogin from "../pages/Authentication/auth-login"
import AuthResetPassword from "../pages/Authentication/auth-re-password"
import AuthLockScreen from "../pages/Authentication/auth-lock-screen"
import AuthNewPassword from "../pages/Authentication/auth-new-password"
import AuthNotAccess from "../pages/Authentication/auth-not-access"

// Pages utilisateur
import Profile from "../pages/User-Profile/profile"
import Calendar from "../pages/Apps/calendar"

// Pages admin
import AdminDashboard from "../pages/Admin/Dashboard"
import AdminUserListe from "../pages/Admin/users/user-list"
import AdminUserEdit from "../pages/Admin/users/user-edit"
import AdminUserDetail from "../pages/Admin/users/user-details"
import AdminUserCreate from "../pages/Admin/users/user-create"
import SettingsPage from "../pages/Admin/settings/settings"
import AuditLogManagement from "../pages/Admin/settings/audit-log"
import ContactManagement from "../pages/Admin/contacts/contact"
import AboutManagement from "../pages/Admin/aboutUs/aboutManagement"
import HistoriqueManagement from "../pages/Admin/historique/historiqueManagement"
import ReportManagement from "../pages/Admin/gouvernance-repport/reportManagement"
import MentionLegalManagement from "../pages/Admin/mention-legal/mention-legal"

// Pages IFCL
import IFCLListAdmin from "../pages/Admin/IFCL/IFCLListAdmin"
import IFCLFormAdmin from "../pages/Admin/IFCL/IFCLForm"
import IFCLDetailsAdmin from "../pages/Admin/IFCL/IFCLDetails"
import MapsIfcl from "../pages/Admin/IFCL/maps"

// Pages équipe
import TeamMembersAdmin from "../pages/Admin/team-members/TeamMembers"
import TeamMemberFormAdmin from "../pages/Admin/team-members/TeamMemberForm"

// Pages actualités
import NewsEdit from "../pages/Admin/news/news-edit"
import NewsletterSubscribersManagement from "../pages/Admin/news/newsletter"

// Pages partenaires
import PartnerManagement from "../pages/Admin/partners/partner"
import PartnerEdit from "../pages/Admin/partners/PartnerEdit"
import PartnerDetails from "../pages/Admin/partners/PartnerDetails"

// Pages activités
import ActivitesManagement from "../pages/Admin/activities/activites"
import ActivitesEdit from "../pages/Admin/activities/activites-edit"
import ActivitesDetails from "../pages/Admin/activities/activites-details"

// Pages événements
import EventManagement from "../pages/Admin/events/newManagement"
import CalendarManagement from "../pages/Admin/events/calandar"
import CampaignsManagement from "../pages/Admin/events/CampaignsManagement"

// Pages discussions
import DashboardThemeDiscussion from "../pages/theme-discussion/Dashboard"
import ThemeList from "../pages/theme-discussion/themes/ThemeList"
import ThemeForm from "../pages/theme-discussion/themes/ThemeForm"
import ThemeView from "../pages/theme-discussion/themes/ThemeView"
import DiscussionList from "../pages/theme-discussion/discussions/DiscussionList"
import DiscussionForm from "../pages/theme-discussion/discussions/DiscussionForm"
import DiscussionView from "../pages/theme-discussion/discussions/DiscussionView"
import AuthActivateAccount from "../pages/Authentication/auth-activated"
// Pages ressources
import ResourcesManagement from "../pages/Admin/resources/resources-manegement"
// Page d'erreur
import ErrorPage from "../pages/error"
import MailerManagement from "../pages/Admin/settings/Mailer"
import NewsManagement from "../pages/Admin/news/news"
import NewsDetails from "../pages/Admin/news/new-detail"
import ResourceDetail from "../pages/Admin/resources/ResourceDetail"


export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth/login" element={<AuthLogin />} />
      <Route path="/auth/re-password" element={<AuthResetPassword />} />
      <Route path="/auth/new-password" element={<AuthNewPassword />} />
      <Route path="/auth/lock-screen" element={<AuthLockScreen />} />
      <Route path="/auth/not-access" element={<AuthNotAccess />} />
      <Route path="/auth/activate" element={<AuthActivateAccount />} />
      <Route path="/error-page" element={<ErrorPage />} />

      {/* <Route path="*" element={<ErrorPage />} /> */}
      

      {/* Auth requis (pas de permission spécifique) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/calendar" element={<Calendar />} />
        {/* Discussions ouvertes à tous les membres connectés */}
        <Route path="/dashboard-theme" element={<DashboardThemeDiscussion />} />
        <Route path="/themes" element={<ThemeList />} />
        <Route path="/themes/new" element={<ThemeForm />} />
        <Route path="/themes/:id" element={<ThemeView />} />
        <Route path="/themes/:id/edit" element={<ThemeForm />} />
        <Route path="/themes/slug/:slug" element={<ThemeView />} />
        <Route path="/themes/:id/discussions" element={<DiscussionList />} />
        <Route path="/discussions" element={<DiscussionList />} />
        <Route path="/discussions/new" element={<DiscussionForm />} />
        <Route path="/discussions/:id" element={<DiscussionView />} />
        <Route path="/discussions/:id/edit" element={<DiscussionForm />} />
        <Route path="/discussions/:discussionId/comments" element={<DiscussionView />} />
        <Route path="/themes/:themeId/discussions" element={<DiscussionList />} />
        <Route path="/themes/:themeId/discussions/new" element={<DiscussionForm />} />
        <Route path="/comments/:id/replies" element={<DiscussionView />} />
        <Route path="/users/:userId/comments" element={<DiscussionList />} />
        <Route path="/search" element={<ThemeList />} />
        <Route path="/search/themes" element={<ThemeList />} />
        <Route path="/search/discussions" element={<DiscussionList />} />
      </Route>

      {/* Admin – permissions spécifiques (ET rôle si tu veux) */}
      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_UTILISATEURS"]} />
      }>
        <Route path="/admin/users" element={<AdminUserListe />} />
        <Route path="/admin/users/:id/edit" element={<AdminUserEdit />} />
        <Route path="/admin/users/:id/details" element={<AdminUserDetail />} />
        <Route path="/admin/users/create" element={<AdminUserCreate />} />

        <Route path="/admin/team-members" element={<TeamMembersAdmin />} />
        <Route path="/admin/team-members/:id/edit" element={<TeamMemberFormAdmin />} />
        <Route path="/admin/team-members/create" element={<TeamMemberFormAdmin />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_ESPACE_APROPOS"]} />
      }>
        <Route path="/admin/about-us" element={<AboutManagement />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN"]} /* pas de permission requise */ />
      }>
        <Route path="/admin/audit-logs" element={<AuditLogManagement />} />
        <Route path="/admin/contacts" element={<ContactManagement />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
        <Route path="/admin/mailer" element={<MailerManagement />} />

        <Route path="/admin/activities" element={<ActivitesManagement />} />
        <Route path="/admin/activities/:id/edit" element={<ActivitesEdit />} />
        <Route path="/admin/activities/:id/view" element={<ActivitesDetails />} />
        <Route path="/admin/activities/create" element={<ActivitesEdit />} />
        <Route path="/admin/events" element={<EventManagement />} />
        <Route path="/admin/calendar" element={<CalendarManagement />} />
        <Route path="/admin/historiques" element={<HistoriqueManagement />} />
        <Route path="/admin/gouvernance-reports" element={<ReportManagement />} />
        <Route path="/admin/mention-legal" element={<MentionLegalManagement />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_RESSOURCES"]} />
      }>
        <Route path="/admin/resources" element={<ResourcesManagement />} />
        <Route path="/admin/resources/:id" element={<ResourceDetail />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_ACTUALITES"]} />
      }>
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/news/:id/edit" element={<NewsEdit />} />
        <Route path="/admin/news/:id/view" element={<NewsDetails />} />
        <Route path="/admin/news/create" element={<NewsEdit />} />
        <Route path="/admin/campaigns" element={<CampaignsManagement />} />
        <Route path="/admin/newsletter" element={<NewsletterSubscribersManagement />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_ACTIVITES"]} />
      }>
        <Route path="/admin/activities" element={<ActivitesManagement />} />
        <Route path="/admin/activities/:id/edit" element={<ActivitesEdit />} />
        <Route path="/admin/activities/:id/view" element={<ActivitesDetails />} />
        <Route path="/admin/activities/create" element={<ActivitesEdit />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_EVENEMENTS"]} />
      }>
        <Route path="/admin/events" element={<EventManagement />} />
        <Route path="/admin/calendar" element={<CalendarManagement />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_PARTENARIATS"]} />
      }>
        <Route path="/admin/partners" element={<PartnerManagement />} />
        <Route path="/admin/partners/:id/edit" element={<PartnerEdit />} />
        <Route path="/admin/partners/:id/details" element={<PartnerDetails />} />
      </Route>

      <Route element={
        <ProtectedRoute allowedRoles={["ADMIN", "MEMBER"]} requiredPermissions={["GERER_BUREAUX"]} />
      }>
        <Route path="/admin/ifcl" element={<IFCLListAdmin />} />
        <Route path="/admin/ifcl/:id/edit" element={<IFCLFormAdmin />} />
        <Route path="/admin/ifcl/:id/details" element={<IFCLDetailsAdmin />} />
        <Route path="/admin/ifcl/create" element={<IFCLFormAdmin />} />
        <Route path="/admin/ifcl/maps" element={<MapsIfcl />} />
      </Route>


      <Route path="*" element={<Navigate to="/error-page" replace />} />
    </Routes>
  )
}
