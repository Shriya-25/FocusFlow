import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { BackIcon } from '../components/Icons/AppIcons';
import { getThemeBrand } from '../utils/brand';
import { useSettingsStore } from '../storage/settingsStore';
import {
  readSessionHistory,
  SessionHistoryEntry,
} from '../storage/sessionHistory';

type Props = {
  onBack?: () => void;
};

type HeatCell = 0 | 1 | 2 | 3 | 4;

type DistributionItem = {
  label: string;
  percent: number;
  seconds: number;
  color: string;
};

type AnalyticsModel = {
  todayFocusSeconds: number;
  weekFocusSeconds: number;
  todayFocusSessions: number;
  trendValues: number[];
  trendLabels: string[];
  bestDayLabel: string;
  bestDaySeconds: number;
  avgDailySeconds: number;
  heatmap: HeatCell[][];
  distribution: DistributionItem[];
  distributionTotalFocusSeconds: number;
  ratioFocusSeconds: number;
  ratioBreakSeconds: number;
};

const HEAT_LEVEL_COLORS = [
  'rgba(15, 23, 42, 0.8)',
  'rgba(129, 92, 240, 0.32)',
  'rgba(129, 92, 240, 0.56)',
  'rgba(192, 132, 252, 0.78)',
  '#FF8A5B',
] as const;

const DISTRIBUTION_COLORS = ['#815cf0', '#C084FC', '#FF9068', '#7ED4B5'];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DONUT_SIZE = 172;
const DONUT_STROKE = 12;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const EMPTY_ANALYTICS: AnalyticsModel = {
  todayFocusSeconds: 0,
  weekFocusSeconds: 0,
  todayFocusSessions: 0,
  trendValues: [0, 0, 0, 0, 0, 0, 0],
  trendLabels: DAY_LABELS,
  bestDayLabel: DAY_LABELS[0],
  bestDaySeconds: 0,
  avgDailySeconds: 0,
  heatmap: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  distribution: [{ label: 'No Focus Data', percent: 1, seconds: 0, color: '#815cf0' }],
  distributionTotalFocusSeconds: 0,
  ratioFocusSeconds: 0,
  ratioBreakSeconds: 0,
};

const sumSeconds = (entries: SessionHistoryEntry[]) => {
  return entries.reduce((total, entry) => total + entry.durationSeconds, 0);
};

const startOfDay = (value: Date | number) => {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
};

const addDays = (baseStartOfDayMs: number, offsetDays: number) => {
  return baseStartOfDayMs + offsetDays * 24 * 60 * 60 * 1000;
};

const getWeekStartMonday = (dayStartMs: number) => {
  const date = new Date(dayStartMs);
  const dayIndex = date.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
  return addDays(dayStartMs, mondayOffset);
};

const formatHoursAndMinutes = (seconds: number) => {
  const safe = Math.max(0, Math.round(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

const buildTrendPath = (values: number[]) => {
  const width = 400;
  const bottomY = 120;
  const minY = 24;
  const maxY = 104;
  const divisor = Math.max(...values, 1);

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const normalized = value / divisor;
    const y = maxY - normalized * (maxY - minY);
    return { x, y };
  });

  const linePath = points.reduce((path, point, index) => {
    const command = `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    return index === 0 ? `M${command}` : `${path} L${command}`;
  }, '');

  const fillPath = `${linePath} L${width},${bottomY} L0,${bottomY} Z`;

  return {
    linePath,
    fillPath,
  };
};

const computeAnalytics = (history: SessionHistoryEntry[]): AnalyticsModel => {
  if (history.length === 0) {
    return EMPTY_ANALYTICS;
  }

  const now = Date.now();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const weekStart = addDays(todayStart, -6);

  const focusEntries = history.filter(entry => entry.sessionType === 'focus');
  const breakEntries = history.filter(entry => entry.sessionType !== 'focus');

  const todayFocusEntries = focusEntries.filter(
    entry => entry.completedAt >= todayStart && entry.completedAt < tomorrowStart,
  );

  const weekFocusEntries = focusEntries.filter(
    entry => entry.completedAt >= weekStart && entry.completedAt < tomorrowStart,
  );

  const trendLabels: string[] = [];
  const trendValues: number[] = [];

  for (let index = 0; index < 7; index += 1) {
    const dayStart = addDays(weekStart, index);
    const dayEnd = addDays(dayStart, 1);
    trendLabels.push(new Date(dayStart).toLocaleDateString('en-US', { weekday: 'short' }));

    const daySeconds = sumSeconds(
      weekFocusEntries.filter(entry => entry.completedAt >= dayStart && entry.completedAt < dayEnd),
    );
    trendValues.push(daySeconds);
  }

  const bestDayIndex = trendValues.reduce((best, value, index, arr) => {
    return value > arr[best] ? index : best;
  }, 0);

  const heatStart = addDays(getWeekStartMonday(todayStart), -28);
  const heatDailyValues: number[] = [];

  for (let index = 0; index < 35; index += 1) {
    const dayStart = addDays(heatStart, index);
    const dayEnd = addDays(dayStart, 1);

    const daySeconds = sumSeconds(
      focusEntries.filter(entry => entry.completedAt >= dayStart && entry.completedAt < dayEnd),
    );
    heatDailyValues.push(daySeconds);
  }

  const heatMax = Math.max(...heatDailyValues, 0);
  const heatLevels: HeatCell[] = heatDailyValues.map(value => {
    if (value <= 0) {
      return 0;
    }

    if (heatMax <= 0) {
      return 1;
    }

    return Math.min(4, Math.max(1, Math.ceil((value / heatMax) * 4))) as HeatCell;
  });

  const heatmap: HeatCell[][] = [];
  for (let row = 0; row < 5; row += 1) {
    heatmap.push(heatLevels.slice(row * 7, row * 7 + 7));
  }

  const focusByTag = new Map<string, number>();
  focusEntries.forEach(entry => {
    const rawName = entry.tagName?.trim();
    const label = rawName && rawName.length > 0 ? rawName : 'Unlabeled';
    focusByTag.set(label, (focusByTag.get(label) ?? 0) + entry.durationSeconds);
  });

  let distribution: DistributionItem[];
  const totalFocusSeconds = sumSeconds(focusEntries);

  if (focusByTag.size === 0 || totalFocusSeconds <= 0) {
    distribution = [{ label: 'No Focus Data', percent: 1, seconds: 0, color: '#815cf0' }];
  } else {
    const sorted = [...focusByTag.entries()]
      .map(([label, seconds]) => ({ label, seconds }))
      .sort((a, b) => b.seconds - a.seconds);

    const topThree = sorted.slice(0, 3);
    const otherSeconds = sorted.slice(3).reduce((sum, item) => sum + item.seconds, 0);

    if (otherSeconds > 0) {
      topThree.push({ label: 'Other', seconds: otherSeconds });
    }

    distribution = topThree.map((item, index) => ({
      label: item.label,
      seconds: item.seconds,
      percent: item.seconds / totalFocusSeconds,
      color: DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length],
    }));
  }

  const ratioWindowStart = addDays(todayStart, -29);
  const ratioFocusEntries = focusEntries.filter(entry => entry.completedAt >= ratioWindowStart);
  const ratioBreakEntries = breakEntries.filter(entry => entry.completedAt >= ratioWindowStart);

  let ratioFocusSeconds = sumSeconds(ratioFocusEntries);
  let ratioBreakSeconds = sumSeconds(ratioBreakEntries);

  if (ratioFocusSeconds === 0 && ratioBreakSeconds === 0) {
    ratioFocusSeconds = totalFocusSeconds;
    ratioBreakSeconds = sumSeconds(breakEntries);
  }

  return {
    todayFocusSeconds: sumSeconds(todayFocusEntries),
    weekFocusSeconds: sumSeconds(weekFocusEntries),
    todayFocusSessions: todayFocusEntries.length,
    trendValues,
    trendLabels,
    bestDayLabel: trendLabels[bestDayIndex] ?? DAY_LABELS[0],
    bestDaySeconds: trendValues[bestDayIndex] ?? 0,
    avgDailySeconds: sumSeconds(weekFocusEntries) / 7,
    heatmap,
    distribution,
    distributionTotalFocusSeconds: totalFocusSeconds,
    ratioFocusSeconds,
    ratioBreakSeconds,
  };
};

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryCard}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
    </View>
  );
}

function TrendCard({
  violet,
  peach,
  values,
  labels,
  bestDayLabel,
  bestDaySeconds,
  avgDailySeconds,
}: {
  violet: string;
  peach: string;
  values: number[];
  labels: string[];
  bestDayLabel: string;
  bestDaySeconds: number;
  avgDailySeconds: number;
}) {
  const { linePath, fillPath } = buildTrendPath(values);

  return (
    <View style={s.glassCard}>
      <View style={s.cardHeaderRow}>
        <Text style={s.cardTitle}>Focus Trend</Text>
        <Text style={s.cardHint}>Last 7 Days</Text>
      </View>

      <View style={s.chartArea}>
        <Svg width="100%" height="100%" viewBox="0 0 400 130">
          <Defs>
            <SvgGradient id="trendLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={violet} />
              <Stop offset="50%" stopColor="#C084FC" />
              <Stop offset="100%" stopColor={peach} />
            </SvgGradient>
            <SvgGradient id="trendFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#C084FC" stopOpacity="0.32" />
              <Stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
            </SvgGradient>
          </Defs>

          <Path d={fillPath} fill="url(#trendFill)" />
          <Path d={linePath} fill="none" stroke="url(#trendLine)" strokeWidth={4} strokeLinecap="round" />
        </Svg>
      </View>

      <View style={s.dayRow}>
        {labels.map(day => (
          <Text key={day} style={s.dayLabel}>
            {day}
          </Text>
        ))}
      </View>

      <View style={s.trendMetaWrap}>
        <View style={s.trendMetaRow}>
          <View style={s.trendMetaLeft}>
            <View style={[s.dot, { backgroundColor: '#C084FC' }]} />
            <Text style={s.trendMetaLabel}>Best Day</Text>
          </View>
          <Text style={s.trendMetaValue}>{`${bestDayLabel} - ${formatHoursAndMinutes(bestDaySeconds)}`}</Text>
        </View>
        <View style={s.trendMetaRow}>
          <View style={s.trendMetaLeft}>
            <View style={[s.dot, { backgroundColor: '#815cf0' }]} />
            <Text style={s.trendMetaLabel}>Average</Text>
          </View>
          <Text style={s.trendMetaValue}>{`${formatHoursAndMinutes(avgDailySeconds)}/day`}</Text>
        </View>
      </View>
    </View>
  );
}

function HeatmapCard({ heatmap }: { heatmap: HeatCell[][] }) {
  return (
    <View style={s.glassCard}>
      <View style={s.heatLegendRow}>
        <Text style={s.heatLegendText}>Less</Text>
        <View style={s.legendBoxesWrap}>
          {HEAT_LEVEL_COLORS.map(color => (
            <View key={color} style={[s.legendBox, { backgroundColor: color }]} />
          ))}
        </View>
        <Text style={s.heatLegendText}>More</Text>
      </View>

      <View style={s.heatGrid}>
        {heatmap.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <View
              key={`${rowIndex}-${columnIndex}`}
              style={[s.heatCell, { backgroundColor: HEAT_LEVEL_COLORS[cell] }]}
            />
          )),
        )}
      </View>

      <View style={s.dayRow}>
        {DAY_LABELS.map(day => (
          <Text key={day} style={s.dayLabel}>
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
}

function DistributionCard({
  distribution,
  totalFocusSeconds,
}: {
  distribution: DistributionItem[];
  totalFocusSeconds: number;
}) {
  let accumulated = 0;

  return (
    <View style={s.glassCard}>
      <View style={s.distributionCenterWrap}>
        <View style={s.donutWrap}>
          <Svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
            <Circle
              cx={DONUT_SIZE / 2}
              cy={DONUT_SIZE / 2}
              r={DONUT_RADIUS}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={DONUT_STROKE}
              fill="none"
            />

            {distribution.map(item => {
              const segmentLength = DONUT_CIRCUMFERENCE * item.percent;
              const segment = (
                <Circle
                  key={item.label}
                  cx={DONUT_SIZE / 2}
                  cy={DONUT_SIZE / 2}
                  r={DONUT_RADIUS}
                  stroke={item.color}
                  strokeWidth={DONUT_STROKE}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${segmentLength} ${DONUT_CIRCUMFERENCE}`}
                  strokeDashoffset={-accumulated}
                  transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                />
              );

              accumulated += segmentLength;
              return segment;
            })}
          </Svg>

          <View style={s.donutCenterTextWrap}>
            <Text style={s.donutTotal}>{formatHoursAndMinutes(totalFocusSeconds)}</Text>
            <Text style={s.donutCaption}>FOCUS TOTAL</Text>
          </View>
        </View>
      </View>

      <View style={s.legendRowsWrap}>
        {distribution.map(item => (
          <View key={item.label} style={s.legendRow}>
            <View style={s.legendLeft}>
              <View style={[s.dot, { backgroundColor: item.color }]} />
              <Text style={s.legendLabel}>{item.label}</Text>
            </View>
            <Text style={s.legendValue}>{`${Math.round(item.percent * 100)}%`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FocusBreakCard({
  focusSeconds,
  breakSeconds,
}: {
  focusSeconds: number;
  breakSeconds: number;
}) {
  const total = focusSeconds + breakSeconds;
  const focusPercent = total > 0 ? Math.round((focusSeconds / total) * 100) : 0;
  const breakPercent = Math.max(0, 100 - focusPercent);

  return (
    <View style={s.glassCard}>
      <View style={s.ratioHeaderRow}>
        <View>
          <Text style={s.ratioTitle}>Focus Time</Text>
          <Text style={s.ratioValue}>{`${formatHoursAndMinutes(focusSeconds)} (${focusPercent}%)`}</Text>
        </View>
        <View style={s.ratioRight}>
          <Text style={s.ratioTitle}>Break Time</Text>
          <Text style={s.ratioValue}>{`${formatHoursAndMinutes(breakSeconds)} (${breakPercent}%)`}</Text>
        </View>
      </View>

      <View style={s.ratioBarTrack}>
        <LinearGradient
          colors={['#815cf0', '#C084FC', '#FF9068']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[s.ratioBarFill, { width: `${focusPercent}%` }]}
        />
      </View>

      <Text style={s.ratioFootnote}>Based on recent completed sessions.</Text>
    </View>
  );
}

export default function StatisticsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore(state => state.darkMode);
  const theme = React.useMemo(() => getThemeBrand(darkMode), [darkMode]);
  const [history, setHistory] = React.useState<SessionHistoryEntry[]>([]);

  React.useEffect(() => {
    let isMounted = true;

    readSessionHistory().then(stored => {
      if (!isMounted) {
        return;
      }
      setHistory(stored);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const analytics = React.useMemo(() => computeAnalytics(history), [history]);

  return (
    <View style={[s.root, { backgroundColor: theme.bgStart }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[theme.bgStart, theme.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.headerRow}>
          <Pressable style={s.backButton} onPress={onBack} android_ripple={{ color: 'rgba(255,255,255,0.1)' }}>
            <BackIcon size={22} color="#fff" />
          </Pressable>
          <Text style={s.headerTitle}>Statistics</Text>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.summaryRow}>
          <SummaryCard label="TODAY" value={formatHoursAndMinutes(analytics.todayFocusSeconds)} />
          <SummaryCard label="THIS WEEK" value={formatHoursAndMinutes(analytics.weekFocusSeconds)} />
          <SummaryCard label="SESSIONS" value={analytics.todayFocusSessions.toString()} />
        </View>

        <View style={s.sectionWrap}>
          <TrendCard
            violet={theme.violet}
            peach={theme.peach}
            values={analytics.trendValues}
            labels={analytics.trendLabels}
            bestDayLabel={analytics.bestDayLabel}
            bestDaySeconds={analytics.bestDaySeconds}
            avgDailySeconds={analytics.avgDailySeconds}
          />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus Intensity Heatmap</Text>
          <HeatmapCard heatmap={analytics.heatmap} />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus Distribution</Text>
          <DistributionCard
            distribution={analytics.distribution}
            totalFocusSeconds={analytics.distributionTotalFocusSeconds}
          />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus / Break Ratio</Text>
          <FocusBreakCard
            focusSeconds={analytics.ratioFocusSeconds}
            breakSeconds={analytics.ratioBreakSeconds}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 42,
    height: 42,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  summaryValue: {
    marginTop: 4,
    color: '#C084FC',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionWrap: {
    marginTop: 22,
    gap: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  glassCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
  },
  chartArea: {
    marginTop: 10,
    height: 120,
  },
  dayRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayLabel: {
    width: 30,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.42)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  trendMetaWrap: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
    gap: 8,
  },
  trendMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  trendMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  trendMetaLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontWeight: '600',
  },
  trendMetaValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heatLegendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  heatLegendText: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 10,
    fontWeight: '600',
  },
  legendBoxesWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  legendBox: {
    width: 11,
    height: 11,
    borderRadius: 2,
  },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 9,
    columnGap: 9,
    justifyContent: 'space-between',
  },
  heatCell: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 3,
  },
  distributionCenterWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  donutWrap: {
    width: DONUT_SIZE,
    height: DONUT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenterTextWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutTotal: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 31,
    textAlign: 'center',
  },
  donutCaption: {
    color: 'rgba(192,132,252,0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  legendRowsWrap: {
    marginTop: 8,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '72%',
  },
  legendLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 14,
    fontWeight: '500',
  },
  legendValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  ratioHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 10,
  },
  ratioRight: {
    alignItems: 'flex-end',
  },
  ratioTitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  ratioValue: {
    marginTop: 3,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  ratioBarTrack: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(129,92,240,0.25)',
  },
  ratioBarFill: {
    height: '100%',
  },
  ratioFootnote: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '500',
  },
});
