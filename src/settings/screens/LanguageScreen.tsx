import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  useAppTranslation,
  useLocalization,
} from "../../i18n";
import { Input } from "../../components/Input";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";

const colors = {
  action: "#0066FF",
  heading: "#1E1E2D",
  muted: "#A2A2A7",
  separator: "#F0F0F2",
  surface: "#F4F4F4",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});

const Content = styled.View({
  paddingHorizontal: 20,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const SearchInput = styled(Input)({
  marginTop: 30,
});

const LanguageList = styled.View({
  marginTop: 28,
});

const LanguageRow = styled(Pressable)({
  alignItems: "center",
  borderBottomColor: colors.separator,
  borderBottomWidth: 1,
  flexDirection: "row",
  height: 76,
});

const Artwork = styled.View({
  alignItems: "center",
  backgroundColor: "#EAF1FF",
  borderRadius: 24,
  height: 48,
  justifyContent: "center",
  marginRight: 16,
  width: 48,
});

const ArtworkText = styled.Text({
  color: colors.action,
  fontFamily: "Poppins-SemiBold",
  fontSize: 12,
});

const LanguageCopy = styled.View({
  flex: 1,
});

const LanguageName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 15,
  lineHeight: 20,
});

const NativeName = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 2,
});

const Selection = styled.View<{ active: boolean }>(({ active }) => ({
  alignItems: "center",
  borderColor: active ? colors.action : colors.muted,
  borderRadius: 12,
  borderWidth: active ? 0 : 1,
  height: 24,
  justifyContent: "center",
  width: 24,
}));

export function LanguageScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("language");
  const { locale, setLocale } = useLocalization();

  const selectLanguage = async (language: SupportedLanguage) => {
    await setLocale(language.locale);
  };

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor={colors.surface}
            icon={<ArrowLeftIcon color={colors.heading} size={20} weight="regular" />}
            onPress={() => router.back()}
            testID="language-back"
          />
        }
        title={t("title")}
      />

      <Content>
        <SearchInput
          accessibilityLabel={t("searchPlaceholder")}
          density="compact"
          icon={<MagnifyingGlassIcon color={colors.muted} size={20} weight="regular" />}
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={colors.muted}
          variant="filled"
        />

        <LanguageList>
          {SUPPORTED_LANGUAGES.map((language) => {
            const active = language.locale === locale;

            let labelKey = "english";
            let nativeKey = "englishNative";

            if (language.locale === "fr") {
              labelKey = "french";
              nativeKey = "frenchNative";
            }

            if (language.locale === "es") {
              labelKey = "spanish";
              nativeKey = "spanishNative";
            }

            return (
              <LanguageRow
                accessibilityLabel={t(labelKey)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                key={language.locale}
                onPress={() => void selectLanguage(language)}
                testID={`language-option-${language.locale}`}
              >
                <Artwork>
                  <ArtworkText>{language.locale.toUpperCase()}</ArtworkText>
                </Artwork>
                <LanguageCopy>
                  <LanguageName>{t(labelKey)}</LanguageName>
                  <NativeName>{t(nativeKey)}</NativeName>
                </LanguageCopy>
                <Selection
                  active={active}
                  testID={`language-selected-${language.locale}`}
                >
                  {active ? (
                    <CheckIcon color={colors.white} size={16} weight="bold" />
                  ) : null}
                </Selection>
              </LanguageRow>
            );
          })}
        </LanguageList>
      </Content>
    </Screen>
  );
}
