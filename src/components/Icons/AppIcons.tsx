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
      <Path
        d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.19 9.45C21.37 9.31 21.42 9.05 21.3 8.84L19.3 5.37C19.18 5.16 18.93 5.08 18.71 5.16L16.28 6.14C15.78 5.76 15.24 5.45 14.65 5.23L14.28 2.64C14.25 2.41 14.05 2.25 13.81 2.25H10.19C9.95 2.25 9.75 2.41 9.72 2.64L9.35 5.23C8.76 5.45 8.22 5.76 7.72 6.14L5.29 5.16C5.07 5.08 4.82 5.16 4.7 5.37L2.7 8.84C2.58 9.05 2.63 9.31 2.81 9.45L4.87 11.06C4.82 11.36 4.8 11.68 4.8 12C4.8 12.33 4.82 12.64 4.86 12.94L2.81 14.55C2.63 14.69 2.58 14.95 2.7 15.16L4.7 18.63C4.82 18.84 5.07 18.92 5.29 18.84L7.72 17.86C8.22 18.24 8.76 18.55 9.35 18.77L9.72 21.36C9.75 21.59 9.95 21.75 10.19 21.75H13.81C14.05 21.75 14.25 21.59 14.28 21.36L14.65 18.77C15.24 18.55 15.78 18.24 16.28 17.86L18.71 18.84C18.93 18.92 19.18 18.84 19.3 18.63L21.3 15.16C21.42 14.95 21.37 14.69 21.19 14.55L19.14 12.94Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
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

export function PauseIcon({ size = 44, color = '#fff' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="7" y="6" width="3.5" height="12" rx="1.2" fill={color} />
      <Rect x="13.5" y="6" width="3.5" height="12" rx="1.2" fill={color} />
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

export function InstagramIcon({ size = 26, color = '#FFB190', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="4" width="16" height="16" rx="5" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="16.8" cy="7.3" r="1" fill={color} />
    </Svg>
  );
}

export function GlobeIcon({ size = 26, color = '#C084FC', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M3.8 12H20.2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path
        d="M12 3.7C14.4 6.2 15.7 9 15.7 12C15.7 15 14.4 17.8 12 20.3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M12 3.7C9.6 6.2 8.3 9 8.3 12C8.3 15 9.6 17.8 12 20.3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function EmailIcon({ size = 26, color = '#B497FF', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="6.5" width="17" height="11" rx="2.2" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4.6 8L12 13.2L19.4 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
