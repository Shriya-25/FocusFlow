import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function AnalyticsIcon({ size = 20, color = '#fff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 20.5H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Rect x="5" y="11" width="3" height="7.5" rx="1" fill={color} opacity={0.95} />
      <Rect x="10.5" y="8" width="3" height="10.5" rx="1" fill={color} opacity={0.9} />
      <Rect x="16" y="5" width="3" height="13.5" rx="1" fill={color} opacity={0.85} />
    </Svg>
  );
}

export function SettingsIcon({ size = 20, color = '#fff', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="12" y1="2.8" x2="12" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="21.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="2.8" y1="12" x2="6" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="18" y1="12" x2="21.2" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="5.5" y1="5.5" x2="7.8" y2="7.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16.2" y1="16.2" x2="18.5" y2="18.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="5.5" y1="18.5" x2="7.8" y2="16.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="16.2" y1="7.8" x2="18.5" y2="5.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function PlayIcon({ size = 48, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 6.5L18 12L8 17.5V6.5Z" fill={color} />
    </Svg>
  );
}

export function BackIcon({ size = 22, color = '#fff', strokeWidth = 2.3 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 4.5L8 12L15.5 19.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CrownIcon({ size = 26, color = '#FF8A5B', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 17L5.5 8.8L10 12L12 7L14 12L18.5 8.8L20 17H4Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path d="M7.5 17V19H16.5V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function InfoIcon({ size = 16, color = 'rgba(255,255,255,0.6)', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
      <Line x1="12" y1="10.5" x2="12" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="12" cy="7.6" r="1" fill={color} />
    </Svg>
  );
}

export function TagIcon({ size = 14, color = '#C084FC', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 8.5L8.5 4.5H14.8L19.5 9.2L10.8 17.9L4.5 11.6V8.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx="12.5" cy="7.9" r="1.2" fill={color} />
    </Svg>
  );
}
