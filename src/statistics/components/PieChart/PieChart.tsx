import { useEffect, useMemo } from "react";
import { Animated, Easing, View } from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

import type { PieChartProps, PieChartSlice } from "./types";

const FULL_CIRCLE = 360;
const MINIMUM_ARC_ANGLE = 0.01;
const SEPARATOR_ANGLE = 3.9;
const animationDuration = 2000;
const AnimatedPath = Animated.createAnimatedComponent(Path);

function pointOnCircle(center: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function createArcPath(
  center: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const angle = endAngle - startAngle;

  if (angle >= FULL_CIRCLE - MINIMUM_ARC_ANGLE) {
    const start = pointOnCircle(center, radius, startAngle);
    const midpoint = pointOnCircle(center, radius, startAngle + 180);

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 1 1 ${midpoint.x} ${midpoint.y}`,
      `A ${radius} ${radius} 0 1 1 ${start.x} ${start.y}`,
    ].join(" ");
  }

  const start = pointOnCircle(center, radius, startAngle);
  const end = pointOnCircle(center, radius, endAngle);
  const largeArcFlag = angle > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
  ].join(" ");
}

function getCapAngle(radius: number, strokeWidth: number) {
  if (radius <= 0) {
    return 0;
  }

  const capRadius = Math.min(strokeWidth / 2, radius);
  return (Math.asin(capRadius / radius) * 180) / Math.PI;
}

function getArcLength(radius: number, startAngle: number, endAngle: number) {
  return (radius * (endAngle - startAngle) * Math.PI) / 180;
}

function isValidSlice<TLabel>(
  slice: PieChartSlice<TLabel>,
): slice is PieChartSlice<TLabel> {
  return (
    Number.isFinite(slice.proportion) &&
    slice.proportion >= 0 &&
    slice.proportion <= 1
  );
}

export function PieChart<TLabel = string>({
  data,
  size = 180,
  strokeWidth = 18,
  backgroundColor = "#F8F8FA",
  testID = "pie-chart",
}: Readonly<PieChartProps<TLabel>>) {
  const center = size / 2;
  const outerRadius = Math.max(0, center - 2);
  const innerRadius = Math.max(0, outerRadius - strokeWidth);
  const slices = useMemo(() => {
    const validSlices = data.filter(isValidSlice);
    const total = validSlices.reduce((sum, slice) => sum + slice.proportion, 0);
    const scale = total > 0 ? 1 / total : 0;

    return validSlices.reduce<
      {
        endAngle: number;
        index: number;
        slice: PieChartSlice<TLabel>;
        startAngle: number;
      }[]
    >((result, slice, index) => {
      const startAngle = result[index - 1]?.endAngle ?? 0;
      const endAngle = startAngle + slice.proportion * scale * FULL_CIRCLE;
      return [...result, { endAngle, index, slice, startAngle }];
    }, []);
  }, [data]);
  const positiveSliceCount = slices.filter(
    ({ endAngle, startAngle }) => endAngle > startAngle,
  ).length;
  const radius = (outerRadius + innerRadius) / 2;
  const animationKey = [
    size,
    strokeWidth,
    ...slices.map(({ endAngle, startAngle }) => `${startAngle}:${endAngle}`),
  ].join("|");
  const sliceAnimations = useMemo(
    () => slices.map(() => new Animated.Value(0)),
    [slices],
  );

  useEffect(() => {
    const positiveSlices = slices.filter(
      ({ endAngle, startAngle }) => endAngle > startAngle,
    );

    sliceAnimations.forEach((animation) => {
      animation.stopAnimation();
      animation.setValue(0);
    });

    let elapsedDuration = 0;
    const animations = positiveSlices.map(
      ({ endAngle, index, startAngle }, animationIndex) => {
        const isLastAnimation = animationIndex === positiveSlices.length - 1;
        const duration = isLastAnimation
          ? Math.max(0, animationDuration - elapsedDuration)
          : (animationDuration * (endAngle - startAngle)) / FULL_CIRCLE;
        elapsedDuration += duration;

        return Animated.timing(sliceAnimations[index], {
          duration,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: false,
        });
      },
    );

    if (animations.length > 0) {
      const sequence = Animated.sequence(animations);
      sequence.start();

      return () => sequence.stop();
    }
  }, [animationKey, slices, sliceAnimations]);

  return (
    <View testID={testID}>
      <Svg
        accessible={false}
        height={size}
        testID={`${testID}-svg`}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        <Circle
          cx={center}
          cy={center}
          fill={backgroundColor}
          r={center}
          testID={`${testID}-background`}
        />
        {slices.map(({ endAngle, index, slice, startAngle }) => {
          const angle = endAngle - startAngle;

          if (angle <= 0) {
            return null;
          }

          const isOnlySlice = positiveSliceCount === 1;
          const separator = isOnlySlice
            ? 0
            : Math.min(
                getCapAngle(outerRadius, strokeWidth) + SEPARATOR_ANGLE / 2,
                angle / 2 - MINIMUM_ARC_ANGLE,
              );
          const arcStart = startAngle + Math.max(0, separator);
          const arcEnd = endAngle - Math.max(0, separator);
          const arcLength = getArcLength(radius, arcStart, arcEnd);
          const sliceProgress = sliceAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [arcLength, 0],
          });

          return (
            <AnimatedPath
              d={createArcPath(center, radius, arcStart, arcEnd)}
              fill="none"
              key={`${String(slice.label)}-${index}`}
              stroke={slice.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={[arcLength, arcLength]}
              strokeDashoffset={sliceProgress}
              strokeWidth={outerRadius - innerRadius}
              testID={`${testID}-slice-${index}`}
            />
          );
        })}
      </Svg>
    </View>
  );
}

export type { PieChartSlice };
