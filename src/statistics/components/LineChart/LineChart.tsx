import { useEffect, useState } from "react";
import { Animated, ScrollView, View } from "react-native";
import { Line, Path, Svg, Text as SvgText } from "react-native-svg";

import type { LineChartProps } from "./types";

const defaultWidth = 320;
const defaultHeight = 160;
const defaultPadding = 16;
const defaultPointSpacing = 52;
const defaultLabelHeight = 24;
const lineAnimationDuration = 2000;
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Domain {
  min: number;
  max: number;
}

function getDomain(
  values: number[],
  minimum?: number,
  maximum?: number,
): Domain {
  const finiteValues = values.filter(Number.isFinite);
  const dataMinimum = finiteValues.length ? Math.min(...finiteValues) : 0;
  const dataMaximum = finiteValues.length ? Math.max(...finiteValues) : 1;
  let min = Number.isFinite(minimum) ? minimum! : dataMinimum;
  let max = Number.isFinite(maximum) ? maximum! : dataMaximum;

  if (min === max) {
    const offset = Math.max(Math.abs(min) * 0.1, 1);
    min -= offset;
    max += offset;
  }

  if (min > max) {
    [min, max] = [max, min];
  }

  return { max, min };
}

function scaleValue(
  value: number,
  domain: Domain,
  height: number,
  padding: number,
) {
  const ratio = (value - domain.min) / (domain.max - domain.min);
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  return height - padding - clampedRatio * (height - padding * 2);
}

interface SmoothPath {
  length: number;
  path?: string;
}

function getCubicBezierPoint(
  start: { x: number; y: number },
  firstControl: { x: number; y: number },
  secondControl: { x: number; y: number },
  end: { x: number; y: number },
  t: number,
) {
  const inverseT = 1 - t;
  return {
    x:
      inverseT ** 3 * start.x +
      3 * inverseT ** 2 * t * firstControl.x +
      3 * inverseT * t ** 2 * secondControl.x +
      t ** 3 * end.x,
    y:
      inverseT ** 3 * start.y +
      3 * inverseT ** 2 * t * firstControl.y +
      3 * inverseT * t ** 2 * secondControl.y +
      t ** 3 * end.y,
  };
}

function getCubicBezierLength(
  start: { x: number; y: number },
  firstControl: { x: number; y: number },
  secondControl: { x: number; y: number },
  end: { x: number; y: number },
) {
  let length = 0;
  let previousPoint = start;
  const sampleCount = 20;

  for (let index = 1; index <= sampleCount; index += 1) {
    const point = getCubicBezierPoint(
      start,
      firstControl,
      secondControl,
      end,
      index / sampleCount,
    );
    length += Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
    previousPoint = point;
  }

  return length;
}

function createSmoothPath(points: { x: number; y: number }[]): SmoothPath {
  if (!points.length) {
    return { length: 0 };
  }

  if (points.length === 1) {
    return {
      length: 0,
      path: `M ${points[0].x} ${points[0].y}`,
    };
  }

  const slopes = points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    return (next.y - point.y) / (next.x - point.x);
  });
  const tangents = points.map((_, index) => {
    if (index === 0) {
      return slopes[0];
    }
    if (index === slopes.length) {
      return slopes.at(-1);
    }
    return (slopes[index - 1] + slopes[index]) / 2;
  });

  let length = 0;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const currentTangent = tangents[index];
    const nextTangent = tangents[index + 1];

    if (
      current === undefined ||
      next === undefined ||
      currentTangent === undefined ||
      nextTangent === undefined
    ) {
      continue;
    }

    const deltaX = (next.x - current.x) / 3;
    const firstControlY = current.y + currentTangent * deltaX;
    const secondControlY = next.y - nextTangent * deltaX;
    const firstControl = {
      x: current.x + deltaX,
      y: firstControlY,
    };
    const secondControl = {
      x: next.x - deltaX,
      y: secondControlY,
    };

    length += getCubicBezierLength(current, firstControl, secondControl, next);
    path += ` C ${firstControl.x} ${firstControl.y}, ${secondControl.x} ${secondControl.y}, ${next.x} ${next.y}`;
  }

  return { length, path };
}

function getContentWidth(
  pointCount: number,
  width: number,
  padding: number,
  pointSpacing: number,
) {
  if (pointCount <= 1) {
    return width;
  }

  return Math.max(width, padding * 2 + (pointCount - 1) * pointSpacing);
}

export function LineChart<TLabel = string>({
  data,
  width = defaultWidth,
  height = defaultHeight,
  pointSpacing = defaultPointSpacing,
  padding = defaultPadding,
  minValue,
  maxValue,
  strokeColor = "#0066FF",
  strokeWidth = 3,
  guideColor = "#F4F4F4",
  labelColor = "#A2A2A7",
  labelFontSize = 11,
  showGuides = true,
  showLabels = true,
  testID = "line-chart",
}: Readonly<LineChartProps<TLabel>>) {
  const [pathAnimation] = useState(() => new Animated.Value(0));
  const labelHeight = showLabels ? defaultLabelHeight : 0;
  const plotHeight = height - labelHeight;
  const plotBottom = plotHeight - padding;
  const domain = getDomain(
    data.map((point) => point.value),
    minValue,
    maxValue,
  );
  const contentWidth = getContentWidth(
    data.length,
    width,
    padding,
    pointSpacing,
  );
  const xStep =
    data.length > 1 ? (contentWidth - padding * 2) / (data.length - 1) : 0;
  const points = data
    .filter((point) => Number.isFinite(point.value))
    .map((point, index) => ({
      x: data.length > 1 ? padding + index * xStep : contentWidth / 2,
      y: scaleValue(point.value, domain, plotHeight, padding),
    }));
  const smoothPath = createSmoothPath(points);
  const pathDashOffset = pathAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [smoothPath.length, 0],
  });

  useEffect(() => {
    pathAnimation.stopAnimation();
    pathAnimation.setValue(0);

    if (smoothPath.length === 0) {
      return;
    }

    const animation = Animated.timing(pathAnimation, {
      duration: lineAnimationDuration,
      toValue: 1,
      useNativeDriver: false,
    });
    animation.start();

    return () => animation.stop();
  }, [pathAnimation, smoothPath.length]);

  const chart = (
    <Svg
      accessible={false}
      height={height}
      testID={`${testID}-svg`}
      viewBox={`0 0 ${contentWidth} ${height}`}
      width={contentWidth}
    >
      {showGuides
        ? points.map((point, index) => (
            <Line
              key={`${testID}-guide-${index}`}
              stroke={guideColor}
              strokeLinecap="round"
              strokeWidth={1.5}
              testID={`${testID}-guide-${index}`}
              x1={point.x}
              x2={point.x}
              y1={padding}
              y2={plotBottom}
            />
          ))
        : null}
      {smoothPath.path ? (
        <AnimatedPath
          d={smoothPath.path}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={[smoothPath.length, smoothPath.length]}
          strokeDashoffset={pathDashOffset}
          strokeWidth={strokeWidth}
          testID={`${testID}-path`}
        />
      ) : null}
      {showLabels
        ? data.map((point, index) => (
            <SvgText
              fill={labelColor}
              fontFamily="Poppins-Regular"
              fontSize={labelFontSize}
              key={`${testID}-label-${index}`}
              textAnchor="middle"
              testID={`${testID}-label-${index}`}
              x={data.length > 1 ? padding + index * xStep : contentWidth / 2}
              y={height - 6}
            >
              {String(point.label)}
            </SvgText>
          ))
        : null}
    </Svg>
  );

  if (contentWidth > width) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        testID={`${testID}-scroll`}
      >
        <View testID={`${testID}-content`}>{chart}</View>
      </ScrollView>
    );
  }

  return <View testID={testID}>{chart}</View>;
}
