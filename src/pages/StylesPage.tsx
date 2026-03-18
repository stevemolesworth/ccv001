import { OverflowBreadcrumbs, PageHeader, SectionHeader } from '@diligentcorp/atlas-react-bundle';
import { Box, Chip, Divider, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router';

import PageLayout from '../components/PageLayout.js';

function Label({ children }: { children: string }) {
  return <Chip label={children} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', height: 20, alignSelf: 'center' }} />;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ minWidth: 180 }}>
        <Label>{label}</Label>
      </Box>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

export default function StylesPage() {
  return (
    <PageLayout>
      <PageHeader
        pageTitle="Styles"
        pageSubtitle="Typography, lists, and text styles available in the design system"
        breadcrumbs={
          <OverflowBreadcrumbs
            leadingElement={<span>Connected Compliance</span>}
            items={[{ id: 'styles', label: 'Styles', url: '/styles' }]}
            hideLastItem
            aria-label="Breadcrumbs"
          >
            {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
          </OverflowBreadcrumbs>
        }
      />

      {/* Headings */}
      <SectionHeader title="Headings" />
      <Stack gap={3}>
        <Row label='variant="h1"'>
          <Typography variant="h1">Heading 1</Typography>
        </Row>
        <Row label='variant="h2"'>
          <Typography variant="h2">Heading 2</Typography>
        </Row>
        <Row label='variant="h3"'>
          <Typography variant="h3">Heading 3</Typography>
        </Row>
        <Row label='variant="h4"'>
          <Typography variant="h4">Heading 4</Typography>
        </Row>
        <Row label='variant="h5"'>
          <Typography variant="h5">Heading 5</Typography>
        </Row>
        <Row label='variant="h6"'>
          <Typography variant="h6">Heading 6</Typography>
        </Row>
      </Stack>

      <Divider />

      {/* Body & inline */}
      <SectionHeader title="Body and inline" />
      <Stack gap={3}>
        <Row label='variant="body1"'>
          <Typography variant="body1">Body 1 — the standard paragraph style. Use this for most text content in the UI.</Typography>
        </Row>
        <Row label='variant="textMd"'>
          <Typography variant="textMd">Text MD — medium-sized text style.</Typography>
        </Row>
        <Row label='variant="textSm"'>
          <Typography variant="textSm">Text SM — small text style.</Typography>
        </Row>
        <Row label='variant="labelLg"'>
          <Typography variant="labelLg">Label large</Typography>
        </Row>
        <Row label='variant="labelSm"'>
          <Typography variant="labelSm">Label small</Typography>
        </Row>
        <Row label='variant="labelXs"'>
          <Typography variant="labelXs">Label extra small</Typography>
        </Row>
        <Row label='variant="caption"'>
          <Typography variant="caption">Caption — supplementary or fine-print content.</Typography>
        </Row>
        <Row label='variant="overline"'>
          <Typography variant="overline">Overline text</Typography>
        </Row>
      </Stack>

      <Divider />

      {/* SectionHeader */}
      <SectionHeader title="Section headers" />
      <Stack gap={3}>
        <Row label="<SectionHeader />">
          <SectionHeader title="Section header (default)" />
        </Row>
        <Row label='headingLevel="h2"'>
          <SectionHeader title="Section header — h2" headingLevel="h2" />
        </Row>
        <Row label='headingLevel="h3"'>
          <SectionHeader title="Section header — h3" headingLevel="h3" />
        </Row>
        <Row label="with subtitle">
          <SectionHeader title="Section header" subtitle="With an optional subtitle beneath the title" />
        </Row>
      </Stack>

      <Divider />

      {/* Lists */}
      <SectionHeader title="Lists" />
      <Stack gap={3}>
        <Row label="disc list">
          <List dense disablePadding sx={{ pl: 2 }}>
            {['First item', 'Second item', 'Third item'].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Row>
        <Row label="decimal list">
          <List dense disablePadding sx={{ pl: 2 }}>
            {['First item', 'Second item', 'Third item'].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'decimal', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Row>
        <Row label="with secondary text">
          <List dense disablePadding sx={{ pl: 2 }}>
            {[
              { primary: 'Item with detail', secondary: 'This is the secondary line of text below the primary.' },
              { primary: 'Another item', secondary: 'More supporting detail here.' },
            ].map((item) => (
              <ListItem key={item.primary} divider={false} alignItems="flex-start" sx={{ display: 'list-item', listStyleType: 'disc', py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.primary}
                    </Typography>
                  }
                  secondary={item.secondary}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            ))}
          </List>
        </Row>
      </Stack>
    </PageLayout>
  );
}
