import { router, usePathname } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Typography from 'src/common/components/Typography/Typography';
import { useHeaderStyle } from 'src/common/layouts/Header/HeaderStyle';
import { getHeaderTitle } from 'src/common/layouts/Header/HeaderTitle';
import { Routes } from 'src/routing/paths';

/**
 * Build breadcrumb segments from the current pathname.
 *
 * Structure: Home / <section> / <subsection>
 * "Home" is always the root crumb and links to the Dashboard.
 * On the dashboard itself: Home / Dashboard
 */
function buildBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const crumbs: { label: string; path: string }[] = [];

  // Root is always "Home" → navigates to Dashboard
  crumbs.push({ label: 'Home', path: Routes.DASHBOARD });

  if (pathname.toLowerCase().includes(Routes.DASHBOARD.toLowerCase())) {
    const dashboardLabel = getHeaderTitle(Routes.DASHBOARD) ?? 'Dashboard';
    crumbs.push({ label: dashboardLabel, path: Routes.DASHBOARD });
    return crumbs;
  }

  // Split path into segments, skip empty strings and pure numeric IDs
  const parts = pathname.split('/').filter(Boolean);

  let accumulated = '';
  for (const part of parts) {
    if (/^\d+$/.test(part)) continue; // skip dynamic IDs

    accumulated = `/${part}`;
    const label = getHeaderTitle(accumulated);

    if (label && !crumbs.some((c) => c.label === label)) {
      crumbs.push({ label, path: accumulated });
    }
  }

  // If the full path resolves to a label not yet added, push it
  const fullLabel = getHeaderTitle(pathname);
  if (fullLabel && !crumbs.some((c) => c.label === fullLabel)) {
    crumbs.push({ label: fullLabel, path: pathname });
  }

  return crumbs;
}

interface BreadcrumbsProps {
  currentPath?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath }) => {
  const pathname = usePathname();
  const styles = useHeaderStyle();

  const crumbs = buildBreadcrumbs(currentPath ?? pathname);

  return (
    <View style={styles.breadcrumb}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={`${crumb.path}-${index}`}>
            {/* "/" separator — plain text, not an icon */}
            {index > 0 && (
              <Text style={styles.breadcrumbSeparator}>/</Text>
            )}
            {isLast ? (
              // Current page — dark bold, not clickable
              <Typography variant="textLabel" style={styles.breadcrumbLabelActive}>
                {crumb.label}
              </Typography>
            ) : (
              // Parent page — muted, clickable
              <Pressable
                onPress={() => router.push(crumb.path as any)}
                accessibilityRole="link"
                accessibilityLabel={`Go to ${crumb.label}`}
              >
                <Typography variant="textLabel" style={styles.breadcrumbLabel}>
                  {crumb.label}
                </Typography>
              </Pressable>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default Breadcrumbs;
