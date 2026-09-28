import { View } from "react-native";
import { Line, Rect, Svg } from "react-native-svg";

import type { BarChartDatum, BarChartProps } from "./types";

const defaultWidth = 320;
const defaultHeight = 180;
const defaultPadding = 16;

interface Domain {
  min: number;
  max: number;
}

function getDomain<TLabel>(
  data: BarChartDatum<TLabel>[],
  minimum?: number,
  maximum?: number,
  targetValue?: number,
): Domain {
  const values = data
    .map((datum) => datum.value)
    .concat(Number.isFinite(targetValue) ? [targetValue!] : [])
    .concat([0])
    .filter(Number.isFinite);
  const dataMinimum = values.length ? Math.min(...values) : 0;
  const dataMaximum = values.length ? Math.max(...values) : 1;
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
  return (
    height -
    padding -
    ((value - domain.min) / (domain.max - domain.min)) * (height - padding * 2)
  );
}

export function BarChart<TLabel = string>({
  data,
  width = defaultWidth,
  height = defaultHeight,
  padding = defaultPadding,
  barGap = 12,
  minValue,
  maxValue,
  targetValue,
  barColor = "#0066FF",
  targetColor = "#E16364",
  testID = "bar-chart",
}: Readonly<BarChartProps<TLabel>>) {
  const domain = getDomain(data, minValue, maxValue, targetValue);
  const chartWidth = Math.max(width, padding * 2);
  const barWidth =
    data.length > 0
      ? Math.max(
          1,
          (chartWidth - padding * 2 - barGap * (data.length - 1)) / data.length,
        )
      : 0;
  const zeroY = scaleValue(0, domain, height, padding);

  return (
    <View testID={testID}>
      <Svg
        accessible={false}
        height={height}
        testID={`${testID}-svg`}
        viewBox={`0 0 ${chartWidth} ${height}`}
        width={chartWidth}
      >
        {data.map((datum, index) => {
          if (!Number.isFinite(datum.value)) {
            return null;
          }

          const valueY = scaleValue(datum.value, domain, height, padding);
          const y = Math.min(valueY, zeroY);
          const barHeight = Math.max(1, Math.abs(zeroY - valueY));

          return (
            <Rect
              fill={barColor}
              height={barHeight}
              key={`${String(datum.label)}-${index}`}
              rx={4}
              testID={`${testID}-bar-${index}`}
              width={barWidth}
              x={padding + index * (barWidth + barGap)}
              y={y}
            />
          );
        })}
        {Number.isFinite(targetValue) ? (
          <Line
            stroke={targetColor}
            strokeDasharray="5 5"
            strokeWidth={2}
            testID={`${testID}-target`}
            x1={padding}
            x2={chartWidth - padding}
            y1={scaleValue(targetValue!, domain, height, padding)}
            y2={scaleValue(targetValue!, domain, height, padding)}
          />
        ) : null}
      </Svg>
    </View>
  );
}

export type { BarChartDatum };
