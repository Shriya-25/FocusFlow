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

type Props = {
  onBack?: () => void;
};

type HeatCell = 0 | 1 | 2 | 3 | 4;

const HEAT_LEVEL_COLORS = [
  'rgba(15, 23, 42, 0.8)',
  'rgba(129, 92, 240, 0.32)',
  'rgba(129, 92, 240, 0.56)',
  'rgba(192, 132, 252, 0.78)',
  '#FF8A5B',
] as const;

const HEATMAP_GRID: HeatCell[][] = [
  [2, 1, 0, 4, 3, 1, 3],
  [3, 4, 0, 1, 2, 1, 2],
  [1, 1, 3, 4, 1, 1, 2],
  [2, 2, 0, 1, 3, 4, 2],
  [0, 1, 0, 0, 0, 0, 1],
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DONUT_SIZE = 172;
const DONUT_STROKE = 12;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

const DISTRIBUTION = [
  { label: 'Coding', percent: 0.5, color: '#815cf0' },
  { label: 'Study', percent: 0.3, color: '#C084FC' },
  { label: 'Reading', percent: 0.2, color: '#FF9068' },
];

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryCard}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
    </View>
  );
}

function TrendCard({ violet, peach }: { violet: string; peach: string }) {
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

          <Path
            d="M0,88 C36,52 64,112 100,90 C130,72 150,40 180,58 C206,74 232,104 268,78 C296,58 320,34 344,28 C366,22 382,48 400,56 L400,130 L0,130 Z"
            fill="url(#trendFill)"
          />
          <Path
            d="M0,88 C36,52 64,112 100,90 C130,72 150,40 180,58 C206,74 232,104 268,78 C296,58 320,34 344,28 C366,22 382,48 400,56"
            fill="none"
            stroke="url(#trendLine)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <View style={s.dayRow}>
        {DAY_LABELS.map(day => (
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
          <Text style={s.trendMetaValue}>Friday - 3h 10m</Text>
        </View>
        <View style={s.trendMetaRow}>
          <View style={s.trendMetaLeft}>
            <View style={[s.dot, { backgroundColor: '#815cf0' }]} />
            <Text style={s.trendMetaLabel}>Average</Text>
          </View>
          <Text style={s.trendMetaValue}>1h 48m/day</Text>
        </View>
      </View>
    </View>
  );
}

function HeatmapCard() {
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
        {HEATMAP_GRID.flatMap((row, rowIndex) =>
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

function DistributionCard() {
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

            {DISTRIBUTION.map(item => {
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
            <Text style={s.donutTotal}>32h</Text>
            <Text style={s.donutCaption}>TOTAL</Text>
          </View>
        </View>
      </View>

      <View style={s.legendRowsWrap}>
        {DISTRIBUTION.map(item => (
          <View key={item.label} style={s.legendRow}>
            <View style={s.legendLeft}>
              <View style={[s.dot, { backgroundColor: item.color }]} />
              <Text style={s.legendLabel}>{item.label}</Text>
            </View>
            <Text style={s.legendValue}>{Math.round(item.percent * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FocusBreakCard() {
  return (
    <View style={s.glassCard}>
      <View style={s.ratioHeaderRow}>
        <View>
          <Text style={s.ratioTitle}>Focus Time</Text>
          <Text style={s.ratioValue}>31h 30m (73%)</Text>
        </View>
        <View style={s.ratioRight}>
          <Text style={s.ratioTitle}>Break Time</Text>
          <Text style={s.ratioValue}>11h 50m (27%)</Text>
        </View>
      </View>

      <View style={s.ratioBarTrack}>
        <LinearGradient
          colors={['#815cf0', '#C084FC', '#FF9068']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={s.ratioBarFill}
        />
      </View>
    </View>
  );
}

export default function StatisticsScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();
  const darkMode = useSettingsStore(state => state.darkMode);
  const theme = React.useMemo(() => getThemeBrand(darkMode), [darkMode]);

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
          <SummaryCard label="TODAY" value="2h 15m" />
          <SummaryCard label="THIS WEEK" value="12h 40m" />
          <SummaryCard label="SESSIONS" value="4" />
        </View>

        <View style={s.sectionWrap}>
          <TrendCard violet={theme.violet} peach={theme.peach} />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus Intensity Heatmap</Text>
          <HeatmapCard />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus Distribution</Text>
          <DistributionCard />
        </View>

        <View style={s.sectionWrap}>
          <Text style={s.sectionTitle}>Focus / Break Ratio</Text>
          <FocusBreakCard />
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
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 34,
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
    width: '73%',
    height: '100%',
  },
});
