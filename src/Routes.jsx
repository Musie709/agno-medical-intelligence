import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import LoginRegistration from "pages/login-registration";
import DashboardOverview from "pages/dashboard-overview";
import CaseViewerDetails from "pages/case-viewer-details";
import PersonalCaseManagement from "pages/personal-case-management";
import UserProfileSettings from "pages/user-profile-settings";
import CaseSubmissionForm from "pages/case-submission-form";
import NotFound from "pages/NotFound";
import CaseAnalytics from "pages/case-analytics";
import PublicProfilePage from "./pages/public-profile";

// Simple authentication check (checks for user info in localStorage)
const isAuthenticated = () => {
  return !!localStorage.getItem('userInfo');
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login-registration" replace />;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login-registration" element={<LoginRegistration />} />
        <Route path="/profile/:userId" element={<PublicProfilePage />} />
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><DashboardOverview /></PrivateRoute>} />
        <Route path="/dashboard-overview" element={<PrivateRoute><DashboardOverview /></PrivateRoute>} />
        <Route path="/case-viewer-details" element={<PrivateRoute><CaseViewerDetails /></PrivateRoute>} />
        <Route path="/personal-case-management" element={<PrivateRoute><PersonalCaseManagement /></PrivateRoute>} />
        <Route path="/user-profile-settings" element={<PrivateRoute><UserProfileSettings /></PrivateRoute>} />
        <Route path="/case-submission-form" element={<PrivateRoute><CaseSubmissionForm /></PrivateRoute>} />
        <Route path="/case-analytics" element={<PrivateRoute><CaseAnalytics /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;