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
 */
function buildBreadcrumbs(pathname: string): { label: string; path: string }[] {
  const crumbs: { label: string; path: string }[] = [];

  // Root is always "Home" → navigates to Dashboard
  crumbs.push({ label: 'Home', path: Routes.DASHBOARD });

  // Strip Expo route group prefixes like (admin), (sideMenu), (tabs) and
  // trailing /index segments — they are filesystem conventions, not URL parts
  const cleanedPathname = pathname
    .replace(/\/\([^)]+\)/g, '') // remove (groupName) segments
    .replace(/\/index$/, '')     // remove trailing /index
    .replace(/\/$/, '');         // remove trailing slash

  if (cleanedPathname.toLowerCase().includes(Routes.DASHBOARD.toLowerCase())) {
    const dashboardLabel = getHeaderTitle(Routes.DASHBOARD) ?? 'Dashboard';
    crumbs.push({ label: dashboardLabel, path: Routes.DASHBOARD });
    return crumbs;
  }

  // Split into segments, skip empty strings and pure numeric IDs
  const parts = cleanedPathname.split('/').filter(Boolean);

  // Build accumulated paths so each crumb links to the correct nested route
  let accumulated = '';
  for (const part of parts) {
    if (/^\d+$/.test(part)) continue; // skip dynamic IDs

    accumulated = `${accumulated}/${part}`;
    const label = getHeaderTitle(accumulated);

    if (label && !crumbs.some((c) => c.label === label)) {
      crumbs.push({ label, path: accumulated });
    }
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
