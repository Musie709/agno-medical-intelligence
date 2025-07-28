import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap = {
    '/dashboard-overview': 'Dashboard',
    '/case-submission-form': 'Submit Case',
    '/case-viewer-details': 'Case Details',
    '/personal-case-management': 'My Cases',
    '/user-profile-settings': 'Profile Settings',
    '/login-registration': 'Authentication'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    breadcrumbs.push({
      label: 'Dashboard',
      path: '/dashboard-overview',
      isActive: false
    });

    // Add current page if it's not dashboard
    if (location.pathname !== '/dashboard-overview') {
      const currentPageLabel = pathMap[location.pathname] || 'Page';
      breadcrumbs.push({
        label: currentPageLabel,
        path: location.pathname,
        isActive: true
      });
    } else {
      // Mark dashboard as active if we're on it
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1 && breadcrumbs[0].isActive) {
    return null; // Don't show breadcrumbs on dashboard
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-body mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {crumb.isActive ? (
            <span className="text-foreground font-medium" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;