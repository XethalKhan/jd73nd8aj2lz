import styled from "@emotion/native";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarChart } from "../components/BarChart/BarChart";
import { LineChart } from "../components/LineChart/LineChart";
import { PieChart } from "../components/PieChart/PieChart";
import { useAppTranslation } from "../../i18n";
import {
  categoryProportions,
  euriborData,
  monthlySavings,
} from "../data/statisticsData";

const colors = {
  action: "#0066FF",
  border: "#F0F0F2",
  heading: "#1E1E2D",
  muted: "#7E848D",
  surface: "#FFFFFF",
  background: "#F8F8FA",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.background,
  flex: 1,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const ContentBody = styled.View({
  paddingBottom: 120,
});

const Header = styled.View({
  paddingBottom: 20,
  paddingTop: 12,
});

const Title = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 24,
  lineHeight: 30,
});

const Description = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  lineHeight: 18,
  marginTop: 4,
});

const DashboardCard = styled.View({
  backgroundColor: colors.surface,
  borderColor: colors.border,
  borderRadius: 18,
  borderWidth: 1,
  marginBottom: 16,
  padding: 18,
});

const CardTitle = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-SemiBold",
  fontSize: 17,
  lineHeight: 23,
});

const CardDescription = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 17,
  marginTop: 3,
});

const ChartFrame = styled.View({
  alignItems: "center",
  marginTop: 16,
  overflow: "hidden",
  width: "100%",
});

const Legend = styled.View({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 12,
});

const LegendItem = styled.View({
  alignItems: "center",
  flexDirection: "row",
  marginBottom: 10,
  width: "48%",
});

const LegendDot = styled.View<{ color: string }>(({ color }) => ({
  backgroundColor: color,
  borderRadius: 5,
  height: 10,
  marginRight: 8,
  width: 10,
}));

const LegendLabel = styled.Text({
  color: colors.heading,
  flex: 1,
  fontFamily: "Poppins-Regular",
  fontSize: 11,
});

const LegendValue = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 11,
});

const SavingsSummary = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 17,
  marginTop: 12,
});

const categoryTranslationKeys = {
  Entertainment: "categoryEntertainment",
  Food: "categoryFood",
  Housing: "categoryHousing",
  Other: "categoryOther",
  Shopping: "categoryShopping",
  Transport: "categoryTransport",
} as const;

const monthTranslationKeys = {
  Apr: "monthApr",
  Feb: "monthFeb",
  Jan: "monthJan",
  Jun: "monthJun",
  Mar: "monthMar",
  May: "monthMay",
} as const;

export function StatisticsScreen() {
  const { t } = useAppTranslation("statistics");
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(260, width - 76);
  const translatedEuriborData = euriborData.map((point) => ({
    ...point,
    label: t(monthTranslationKeys[point.label as keyof typeof monthTranslationKeys]),
  }));
  const translatedMonthlySavings = monthlySavings.points.map((point) => ({
    ...point,
    label: t(monthTranslationKeys[point.label as keyof typeof monthTranslationKeys]),
  }));

  return (
    <Screen>
      <Content
        testID="statistics-scroll"
      >
        <ContentBody>
          <Header>
            <Title>{t("title")}</Title>
            <Description>{t("description")}</Description>
          </Header>

          <DashboardCard testID="statistics-euribor-card">
            <CardTitle>{t("euriborTrend")}</CardTitle>
            <CardDescription>
              {t("euriborDescription")}
            </CardDescription>
            <ChartFrame>
              <LineChart
                data={translatedEuriborData}
                height={160}
                maxValue={4}
                minValue={3.5}
                strokeColor="#0066FF"
                strokeWidth={5}
                testID="statistics-line-chart"
                width={chartWidth}
              />
            </ChartFrame>
          </DashboardCard>

          <DashboardCard testID="statistics-category-card">
            <CardTitle>{t("spendingByCategory")}</CardTitle>
            <CardDescription>
              {t("spendingDescription")}
            </CardDescription>
            <ChartFrame>
              <PieChart
                data={categoryProportions}
                size={180}
                testID="statistics-pie-chart"
              />
            </ChartFrame>
            <Legend>
              {categoryProportions.map((category) => (
                <LegendItem key={category.label}>
                  <LegendDot color={category.color} />
                  <LegendLabel>
                    {t(
                      categoryTranslationKeys[
                        category.label as keyof typeof categoryTranslationKeys
                      ],
                    )}
                  </LegendLabel>
                  <LegendValue>
                    {Math.round(category.proportion * 100)}%
                  </LegendValue>
                </LegendItem>
              ))}
            </Legend>
          </DashboardCard>

          <DashboardCard testID="statistics-savings-card">
            <CardTitle>{t("monthlySavings")}</CardTitle>
            <CardDescription>
              {t("monthlySavingsDescription")}
            </CardDescription>
            <ChartFrame>
              <BarChart
                data={translatedMonthlySavings}
                height={180}
                targetValue={monthlySavings.target}
                testID="statistics-bar-chart"
                width={chartWidth}
              />
            </ChartFrame>
            <SavingsSummary>
              {t("monthlyTarget", { amount: monthlySavings.target })}
            </SavingsSummary>
          </DashboardCard>
        </ContentBody>
      </Content>
    </Screen>
  );
}
