import styled from "@emotion/native";
import { useRouter } from "expo-router";
import {
  BellIcon,
  CaretRightIcon,
  ChatCircleDotsIcon,
  GearSixIcon,
  MapPinIcon,
  UserCircleGearIcon,
  UserCircleIcon,
  WalletIcon,
} from "phosphor-react-native";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTranslation } from "../../i18n";
import { IconButton } from "../../components/IconButton";
import { ScreenHeader } from "../../components/ScreenHeader";

const colors = {
  heading: "#1E1E2D",
  icon: "#A2A2A7",
  muted: "#7E848D",
  separator: "#F4F4F4",
  white: "#FFFFFF",
};

const Screen = styled(SafeAreaView)({
  backgroundColor: colors.white,
  flex: 1,
});
const Header = styled(ScreenHeader)({
  marginTop: 10,
});

const Content = styled.ScrollView({
  flex: 1,
  paddingHorizontal: 20,
});

const BackIcon = styled(CaretRightIcon)({
  transform: [{ rotate: "180deg" }],
});

const AccountSummary = styled.View({
  alignItems: "center",
  flexDirection: "row",
  marginBottom: 18,
  marginTop: 32,
});

const Avatar = styled.View({
  alignItems: "center",
  backgroundColor: "#E3E3E5",
  borderRadius: 35,
  height: 70,
  justifyContent: "center",
  width: 70,
});

const AccountCopy = styled.View({
  marginLeft: 22,
});

const AccountName = styled.Text({
  color: colors.heading,
  fontFamily: "Poppins-Medium",
  fontSize: 16,
  lineHeight: 20,
});

const AccountRole = styled.Text({
  color: colors.muted,
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  lineHeight: 16,
  marginTop: 4,
});

const ProfileRow = styled(Pressable)({
  alignItems: "center",
  borderBottomColor: colors.separator,
  borderBottomWidth: 1,
  flexDirection: "row",
  height: 56,
  width: "100%",
});

const RowLabel = styled.Text({
  color: colors.heading,
  flex: 1,
  fontFamily: "Poppins-Regular",
  fontSize: 14,
  lineHeight: 18,
  marginLeft: 18,
});

const RowEnd = styled.View({
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "center",
  minHeight: 24,
  minWidth: 24,
});

const NotificationBadge = styled.View({
  alignItems: "center",
  backgroundColor: "#F20D2F",
  borderRadius: 10,
  height: 20,
  justifyContent: "center",
  marginRight: 3,
  width: 20,
});

const NotificationCount = styled.Text({
  color: colors.white,
  fontFamily: "Poppins-Medium",
  fontSize: 11,
  lineHeight: 14,
});

type ProfileIcon = typeof UserCircleIcon;

const profileRows: {
  key: string;
  Icon: ProfileIcon;
  notification?: string;
}[] = [
  { key: "personalInformation", Icon: UserCircleIcon },
  { key: "paymentPreferences", Icon: WalletIcon },
  { key: "banksAndCards", Icon: WalletIcon },
  { key: "notifications", Icon: BellIcon, notification: "2" },
  { key: "messageCenter", Icon: ChatCircleDotsIcon },
  { key: "address", Icon: MapPinIcon },
  { key: "settings", Icon: GearSixIcon },
];

export function ProfileScreen() {
  const router = useRouter();
  const { t } = useAppTranslation("profile");

  return (
    <Screen>
      <Header
        leftAction={
          <IconButton
            accessibilityLabel={t("goBack")}
            backgroundColor="#F4F4F4"
            icon={<BackIcon color={colors.heading} size={22} weight="regular" />}
            onPress={() => router.back()}
          />
        }
        rightAction={
          <IconButton
            accessibilityLabel={t("editProfile")}
            backgroundColor="#F4F4F4"
            icon={
              <UserCircleGearIcon
                color={colors.heading}
                size={21}
                weight="regular"
              />
            }
            onPress={() => router.push("/edit-profile")}
          />
        }
        title={t("title")}
      />

      <Content>
        <AccountSummary>
          <Avatar accessible accessibilityLabel={t("profileAvatar")} />
          <AccountCopy>
            <AccountName>{t("name")}</AccountName>
            <AccountRole>{t("role")}</AccountRole>
          </AccountCopy>
        </AccountSummary>

        {profileRows.map(({ Icon, key, notification }) => (
          <ProfileRow
            accessibilityLabel={t(key)}
            key={key}
            onPress={() => {
              if (key === "personalInformation") {
                return router.push("/edit-profile");
              }

              if (key === "banksAndCards") {
                return router.push("/settings/list-cards");
              }
            }}
          >
            <Icon color={colors.icon} size={20} weight="regular" />
            <RowLabel>{t(key)}</RowLabel>
            <RowEnd>
              {notification ? (
                <NotificationBadge
                  accessible
                  accessibilityLabel={t("unreadNotifications", {
                    count: notification,
                  })}
                >
                  <NotificationCount>{notification}</NotificationCount>
                </NotificationBadge>
              ) : (
                <CaretRightIcon
                  color={colors.muted}
                  size={18}
                  weight="regular"
                />
              )}
            </RowEnd>
          </ProfileRow>
        ))}
      </Content>
    </Screen>
  );
}
