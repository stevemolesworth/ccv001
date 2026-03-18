import { useState } from 'react';
import {
  AIChatAIMessage,
  AIChatBox,
  AIChatContent,
  AIChatContextProvider,
  AIChatMessageAvatar,
  AIChatMessageHeader,
  AIChatMessageTextBlock,
  AIChatThinkingIndicator,
  AIChatUserMessage,
  OverflowBreadcrumbs,
  PageHeader,
  SectionHeader,
  useAIChatContext,
} from '@diligentcorp/atlas-react-bundle';
import { Box, Container, List, ListItem, ListItemText, Stack, Typography, useTheme } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { NavLink } from 'react-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const EDIT_RESPONSES = [
  "I've updated the section as requested. The changes are reflected in the report on the left.",
  "Done! I've applied those edits. Let me know if you'd like to refine further.",
  "Got it — I've made the changes you described. Feel free to ask for more adjustments.",
  'The report has been updated. Would you like me to make any other changes?',
  "I've revised that section. Review the changes on the left and let me know what you think.",
];

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    role: 'assistant',
    content: "Hi! I can help you edit this report. Describe the changes you'd like to make and I'll apply them.",
    time: nowTime(),
  },
];

export default function ComplianceReportsPage() {
  return (
    <AIChatContextProvider initialHasStartedChat>
      <ReportContent />
    </AIChatContextProvider>
  );
}

function ReportContent() {
  const { isGenerating, setIsGenerating } = useAIChatContext();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  function handleSubmit(prompt: string) {
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: prompt, time: nowTime() }]);
    const delay = 900 + Math.random() * 1100;
    setTimeout(() => {
      const response = EDIT_RESPONSES[Math.floor(Math.random() * EDIT_RESPONSES.length)];
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: nowTime() }]);
      setIsGenerating(false);
    }, delay);
  }

  return (
    <Container
      sx={{
        py: 2,
        height: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack gap={2} sx={{ flex: 1, minHeight: 0 }}>
        <PageHeader
          pageTitle="Compliance reports"
          breadcrumbs={
            <OverflowBreadcrumbs
              leadingElement={<span>Connected Compliance</span>}
              items={[{ id: 'compliance-reports', label: 'Compliance reports', url: '/compliance-reports' }]}
              hideLastItem
              aria-label="Breadcrumbs"
            >
              {({ label, url }) => <NavLink to={url}>{label}</NavLink>}
            </OverflowBreadcrumbs>
          }
        />

        {/* Two-column layout */}
        <Stack direction="row" gap={2} sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Canvas */}
          <Box
            sx={({ palette }) => ({
              flex: 2,
              minWidth: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              border: '1px solid',
              borderColor: palette.divider,
              borderRadius: 2,
              p: 3,
            })}
          >
            <ReportBody />
          </Box>

          {/* Chat */}
          <Box
            sx={({ palette }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: palette.divider,
              borderRadius: 2,
              overflow: 'hidden',
              minWidth: 0,
            })}
          >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2, pt: 2, pb: 4 }}>
              <AIChatContent>
                {messages.map((msg) =>
                  msg.role === 'user' ? (
                    <AIChatUserMessage
                      key={msg.id}
                      alignment="end"
                      message={msg.content}
                      header={<AIChatMessageHeader name="You" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="current-user" initials="YO" />} />}
                    />
                  ) : (
                    <AIChatAIMessage
                      key={msg.id}
                      header={
                        <AIChatMessageHeader name="AI assistant" time={msg.time} avatar={<AIChatMessageAvatar uniqueId="ai-assistant" initials="AI" />} />
                      }
                    >
                      <AIChatMessageTextBlock>{msg.content}</AIChatMessageTextBlock>
                    </AIChatAIMessage>
                  ),
                )}
                {isGenerating && (
                  <AIChatAIMessage
                    header={<AIChatMessageHeader name="AI assistant" time={nowTime()} avatar={<AIChatMessageAvatar uniqueId="ai-assistant" initials="AI" />} />}
                  >
                    <AIChatThinkingIndicator label="Thinking…" />
                  </AIChatAIMessage>
                )}
              </AIChatContent>
            </Box>

            <Box sx={{ flexShrink: 0, px: 2, pb: 2 }}>
              <AIChatBox onSubmit={handleSubmit} onStop={() => setIsGenerating(false)} isUploadAvailable={false} />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
}

function useChartPalette() {
  const theme = useTheme();
  return [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];
}

function CaseVolumeTrendChart() {
  const theme = useTheme();
  const color = theme.palette.primary.main;
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['2022', '2023', '2024', '2025', '2026 (Q1)'],
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'value',
      name: 'Cases',
      nameTextStyle: { color: theme.palette.text.secondary },
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Cases submitted',
        type: 'bar',
        data: [5, 6, 7, 8, 4],
        itemStyle: { color, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 240, width: '100%' }} />;
}

function CaseCategoriesChart() {
  const palette = useChartPalette();
  const theme = useTheme();
  const categories = ['Data Privacy', 'Bribery', 'Health & Safety', 'Discrimination', 'Fraud', 'Harassment'];
  const values = [1, 1, 2, 6, 9, 11];
  const option = {
    tooltip: { trigger: 'axis', formatter: '{b}: {c} cases' },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Cases',
        type: 'bar',
        data: values.map((v, i) => ({ value: v, itemStyle: { color: palette[i % palette.length], borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: 'right', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 100, right: 50, top: 10, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 240, width: '100%' }} />;
}

function IntakeChannelsChart() {
  const theme = useTheme();
  const color = theme.palette.secondary.main;
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'category',
      data: ['Vault Talk', 'Manual intake', 'Open Reporting', 'App'],
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Submissions',
        type: 'bar',
        data: [3, 6, 7, 14],
        itemStyle: { color, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 100, right: 40, top: 10, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 200, width: '100%' }} />;
}

function RegionalDistributionChart() {
  const theme = useTheme();
  const palette = useChartPalette();
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'category',
      data: ['Unknown', 'Singapore', 'Germany', 'United States', 'United Kingdom'],
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Cases',
        type: 'bar',
        data: [
          { value: 4, itemStyle: { color: theme.palette.text.disabled, borderRadius: [0, 4, 4, 0] } },
          { value: 4, itemStyle: { color: palette[3], borderRadius: [0, 4, 4, 0] } },
          { value: 5, itemStyle: { color: palette[2], borderRadius: [0, 4, 4, 0] } },
          { value: 7, itemStyle: { color: palette[1], borderRadius: [0, 4, 4, 0] } },
          { value: 11, itemStyle: { color: palette[0], borderRadius: [0, 4, 4, 0] } },
        ],
        label: { show: true, position: 'right', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 120, right: 40, top: 10, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 220, width: '100%' }} />;
}

function CaseStatusChart() {
  const palette = useChartPalette();
  const theme = useTheme();
  const statusColors = [palette[4], palette[3], palette[0], palette[2]];
  const option = {
    tooltip: { trigger: 'axis', formatter: '{b}: {c} cases' },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'category',
      data: ['New / unactioned', 'Read', 'Under investigation', 'Closed'],
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Cases',
        type: 'bar',
        data: [3, 4, 11, 12].map((v, i) => ({ value: v, itemStyle: { color: statusColors[i], borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: 'right', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 130, right: 50, top: 10, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 180, width: '100%' }} />;
}

function ResolutionTimelineChart() {
  const theme = useTheme();
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, textStyle: { color: theme.palette.text.secondary } },
    xAxis: {
      type: 'value',
      max: 15,
      axisLabel: { color: theme.palette.text.secondary },
      splitLine: { lineStyle: { color: theme.palette.divider } },
    },
    yAxis: {
      type: 'category',
      data: ['Open cases'],
      axisLabel: { color: theme.palette.text.secondary },
      axisLine: { lineStyle: { color: theme.palette.divider } },
    },
    series: [
      {
        name: '< 90 days',
        type: 'bar',
        stack: 'age',
        data: [0],
        itemStyle: { color: theme.palette.success.main },
        label: { show: false },
      },
      {
        name: '90–180 days',
        type: 'bar',
        stack: 'age',
        data: [5],
        itemStyle: { color: theme.palette.warning.main },
        label: { show: true, position: 'inside', formatter: '{c}' },
      },
      {
        name: '180+ days',
        type: 'bar',
        stack: 'age',
        data: [10],
        itemStyle: { color: theme.palette.error.main, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'inside', formatter: '{c}' },
      },
    ],
    grid: { left: 80, right: 40, top: 10, bottom: 50 },
  };
  return <ReactECharts option={option} style={{ height: 130, width: '100%' }} />;
}

function DepartmentalPatternsChart() {
  const theme = useTheme();
  const color = theme.palette.info.main;
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    yAxis: {
      type: 'category',
      data: ['HR', 'Unknown', 'Engineering', 'Sales', 'Finance', 'Operations', 'Legal & Compliance'],
      axisLine: { lineStyle: { color: theme.palette.divider } },
      axisLabel: { color: theme.palette.text.secondary },
    },
    series: [
      {
        name: 'Cases',
        type: 'bar',
        data: [3, 4, 4, 4, 4, 5, 6],
        itemStyle: { color, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: theme.palette.text.primary },
      },
    ],
    grid: { left: 140, right: 40, top: 10, bottom: 30 },
  };
  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} />;
}

function ReportBody() {
  return (
    <Stack gap={3}>
      <SectionHeader title="Acme Global Ltd — Speak Up programme" subtitle="As of 13 March 2026" />
      <Typography variant="h2">Executive summary</Typography>
      <Stack gap={2}>
        <Typography variant="body1">
          Acme Global Ltd's Speak Up programme has recorded a cumulative total of 30 cases since programme inception in Q1 2022, spanning six report categories
          across five jurisdictions. Annual case volumes have grown steadily from 5 cases in 2022 to a projected run-rate of approximately 8–10 cases in 2026,
          with Q1 2026 alone recording 4 submissions — the highest single-quarter total to date. This upward trajectory is broadly indicative of a maturing
          reporting culture, though it also warrants heightened vigilance in case handling capacity.
        </Typography>
        <Typography variant="body1">
          Of the 30 total cases, 40% are recorded as Closed and 36.7% are currently under active investigation, reflecting a reasonably active caseload.
          However, 15 cases remain open as of 13 March 2026, and a significant proportion of these — 10 out of 15, or 67% — have been open for more than 180
          days, representing the most pressing operational concern identified in this reporting period. The programme's overall health is satisfactory in terms
          of intake diversity and geographic reach, but resolution timeliness requires immediate corrective attention.
        </Typography>
      </Stack>

      <Typography variant="h2">Speak Up programme</Typography>

      <Stack gap={3}>
        <Stack gap={1}>
          <Typography variant="h2">Case volume and trends</Typography>
          <Typography variant="body1">
            Since the programme's launch in January 2022, Acme Global Ltd has received 30 cases in total. Annual volumes have increased progressively:
          </Typography>
          <CaseVolumeTrendChart />
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {[
              '5 cases recorded in 2022',
              '6 cases recorded in 2023',
              '7 cases recorded in 2024',
              '8 cases recorded in 2025',
              '4 cases submitted in Q1 2026 — the single busiest quarter on record',
            ].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            This growth pattern signals that awareness of the Speak Up channel is strengthening across the organisation, a positive indicator of programme
            maturity and reporter confidence.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Typography variant="h2">Case categories and intake channels</Typography>
          <Typography variant="body1">Cases by category:</Typography>
          <CaseCategoriesChart />
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {[
              'Harassment — 11 cases (most frequent)',
              'Fraud — 9 cases',
              'Discrimination — 6 cases',
              'Health & Safety — 2 cases',
              'Bribery — 1 case',
              'Data Privacy — 1 case',
            ].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">Cases by intake channel:</Typography>
          <IntakeChannelsChart />
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {['App — 14 submissions (dominant channel)', 'Open Reporting — 7 submissions', 'Manual intake — 6 submissions', 'Vault Talk — 3 submissions'].map(
              (item) => (
                <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ),
            )}
          </List>
          <Typography variant="body1">
            Notably, all Bribery cases were submitted via Manual intake and all Data Privacy cases via Open Reporting, which may reflect the sensitivity
            associated with these categories and a preference for specific reporting mechanisms in those contexts.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Typography variant="h2">Regional distribution</Typography>
          <RegionalDistributionChart />
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {[
              'United Kingdom — 11 cases',
              'United States — 7 cases',
              'Germany — 5 cases',
              'Singapore — 4 cases',
              'Unknown / no country attribution — 4 cases',
            ].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            The concentration of cases in GB and the US is broadly consistent with relative headcount and operational scale. The comparatively lower volume from
            Singapore and Germany warrants investigation to determine whether this reflects genuine lower incidence or a cultural or structural barrier to
            reporting.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Typography variant="h2">Case status and resolution timelines</Typography>
          <Stack direction="row" gap={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Status breakdown
              </Typography>
              <CaseStatusChart />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Open cases by age
              </Typography>
              <ResolutionTimelineChart />
            </Box>
          </Stack>
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {['Closed — 12 cases (40%)', 'Under investigation — 11 cases (36.7%)', 'Read — 4 cases (13.3%)', 'New, unactioned — 3 cases (10%)'].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            As of 13 March 2026, 15 cases remain open. Of these, 10 have exceeded 180 days since submission (67% of all open cases), which is significantly
            beyond standard industry benchmarks recommending resolution within 90 days. Harassment (3 cases) and Fraud (4 cases) aged 180+ days together account
            for 7 of the 10 most aged cases.
          </Typography>
        </Stack>

        <Stack gap={1}>
          <Typography variant="h2">Departmental patterns</Typography>
          <DepartmentalPatternsChart />
          <List dense disablePadding sx={{ pl: 2, '& .MuiListItem-root': { borderBottom: 'none', borderBlockEnd: 'none', borderBottomWidth: 0 } }}>
            {[
              'Legal & Compliance — 6 cases (highest)',
              'Operations — 5 cases',
              'Finance, Sales, and Engineering — 4 cases each',
              'HR — 3 cases',
              'Unknown department — 4 cases',
            ].map((item) => (
              <ListItem key={item} divider={false} sx={{ display: 'list-item', listStyleType: 'disc', py: 0.25 }}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1">
            The concentration of cases within Legal & Compliance is particularly noteworthy given that department's internal governance remit and warrants
            specific management attention.
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="h2">Recommended actions</Typography>
      <List disablePadding sx={{ pl: 2 }}>
        {[
          {
            primary: 'Implement an urgent case aging review for all 180+ day open cases',
            secondary:
              'Ten of the 15 currently open cases have exceeded 180 days without resolution, including 4 Fraud cases and 3 Harassment cases. A dedicated case review should be convened immediately to assess status, assign ownership, and establish target closure dates. Cases in the Read status (13.3%, 4 cases) should also be escalated to active investigation without delay.',
          },
          {
            primary: 'Investigate under-reporting in Health & Safety, Bribery, and Data Privacy categories',
            secondary:
              'These three categories collectively account for only 4 of 30 cases (13%), which is disproportionately low relative to the operational and regulatory risk they represent. A targeted communications and training campaign should be launched to raise awareness of what constitutes a reportable concern in these areas.',
          },
          {
            primary: 'Review reporting barriers in Germany and Singapore',
            secondary:
              'With only 5 and 4 cases respectively, these jurisdictions report at significantly lower rates than GB (11 cases) and the US (7 cases). Localised engagement initiatives — including training delivered in local languages and culturally adapted communication materials — should be deployed to assess and address any structural or cultural disincentives to reporting.',
          },
          {
            primary: 'Investigate the elevated case volume attributed to the Legal & Compliance department',
            secondary:
              'With 6 cases attributing Legal & Compliance as the perpetrator department, the organisation should conduct a confidential internal review to understand the nature of these cases and whether systemic issues exist. Given the governance responsibilities of this function, any findings carry heightened reputational and regulatory risk.',
          },
          {
            primary: 'Strengthen intake data quality to eliminate unknown department and country attributions',
            secondary:
              'Four cases carry no department attribution and 4 carry no country attribution, limiting the ability to conduct meaningful trend analysis. Intake process controls should be reviewed and enhanced to ensure complete perpetrator metadata is captured at submission or during initial case triage.',
          },
        ].map((action) => (
          <ListItem key={action.primary} divider={false} alignItems="flex-start" sx={{ display: 'list-item', listStyleType: 'decimal', py: 1 }}>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {action.primary}
                </Typography>
              }
              secondary={action.secondary}
              secondaryTypographyProps={{ variant: 'body1' }}
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
