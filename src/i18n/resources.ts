import type { Resource } from "i18next";

import addCard from "./locales/en/add-card.json";
import changePassword from "./locales/en/change-password.json";
import createAccount from "./locales/en/create-account.json";
import editProfile from "./locales/en/edit-profile.json";
import enHome from "./locales/en/home.json";
import language from "./locales/en/language.json";
import enListCards from "./locales/en/list-cards.json";
import enLogin from "./locales/en/login.json";
import myCards from "./locales/en/my-cards.json";
import onboarding1 from "./locales/en/onboarding-1.json";
import onboarding2 from "./locales/en/onboarding-2.json";
import onboarding3 from "./locales/en/onboarding-3.json";
import profile from "./locales/en/profile.json";
import sendMoney from "./locales/en/send-money.json";
import settings from "./locales/en/settings.json";
import statistics from "./locales/en/statistics.json";
import tabs from "./locales/en/tabs.json";
import welcome from "./locales/en/welcome.json";
import esAddCard from "./locales/es/add-card.json";
import esChangePassword from "./locales/es/change-password.json";
import esCreateAccount from "./locales/es/create-account.json";
import esEditProfile from "./locales/es/edit-profile.json";
import esHome from "./locales/es/home.json";
import esLanguage from "./locales/es/language.json";
import esListCards from "./locales/es/list-cards.json";
import esLogin from "./locales/es/login.json";
import esMyCards from "./locales/es/my-cards.json";
import esOnboarding1 from "./locales/es/onboarding-1.json";
import esOnboarding2 from "./locales/es/onboarding-2.json";
import esOnboarding3 from "./locales/es/onboarding-3.json";
import esProfile from "./locales/es/profile.json";
import esSendMoney from "./locales/es/send-money.json";
import esSettings from "./locales/es/settings.json";
import esStatistics from "./locales/es/statistics.json";
import esTabs from "./locales/es/tabs.json";
import esWelcome from "./locales/es/welcome.json";
import frAddCard from "./locales/fr/add-card.json";
import frChangePassword from "./locales/fr/change-password.json";
import frCreateAccount from "./locales/fr/create-account.json";
import frEditProfile from "./locales/fr/edit-profile.json";
import frHome from "./locales/fr/home.json";
import frLanguage from "./locales/fr/language.json";
import frListCards from "./locales/fr/list-cards.json";
import frLogin from "./locales/fr/login.json";
import frMyCards from "./locales/fr/my-cards.json";
import frOnboarding1 from "./locales/fr/onboarding-1.json";
import frOnboarding2 from "./locales/fr/onboarding-2.json";
import frOnboarding3 from "./locales/fr/onboarding-3.json";
import frProfile from "./locales/fr/profile.json";
import frSendMoney from "./locales/fr/send-money.json";
import frSettings from "./locales/fr/settings.json";
import frStatistics from "./locales/fr/statistics.json";
import frTabs from "./locales/fr/tabs.json";
import frWelcome from "./locales/fr/welcome.json";

import type { Locale } from "./types";

export const SCREEN_NAMESPACES = [
  "welcome",
  "login",
  "create-account",
  "onboarding-1",
  "onboarding-2",
  "onboarding-3",
  "home",
  "my-cards",
  "statistics",
  "settings",
  "language",
  "profile",
  "edit-profile",
  "list-cards",
  "add-card",
  "change-password",
  "send-money",
  "tabs",
] as const;

const en = {
  welcome,
  login: enLogin,
  "create-account": createAccount,
  "onboarding-1": onboarding1,
  "onboarding-2": onboarding2,
  "onboarding-3": onboarding3,
  home: enHome,
  "my-cards": myCards,
  statistics,
  settings,
  language,
  profile,
  "edit-profile": editProfile,
  "list-cards": enListCards,
  "add-card": addCard,
  "change-password": changePassword,
  "send-money": sendMoney,
  tabs,
};

const fr = {
  welcome: frWelcome,
  login: frLogin,
  "create-account": frCreateAccount,
  "onboarding-1": frOnboarding1,
  "onboarding-2": frOnboarding2,
  "onboarding-3": frOnboarding3,
  home: frHome,
  "my-cards": frMyCards,
  statistics: frStatistics,
  settings: frSettings,
  language: frLanguage,
  profile: frProfile,
  "edit-profile": frEditProfile,
  "list-cards": frListCards,
  "add-card": frAddCard,
  "change-password": frChangePassword,
  "send-money": frSendMoney,
  tabs: frTabs,
};

const es = {
  welcome: esWelcome,
  login: esLogin,
  "create-account": esCreateAccount,
  "onboarding-1": esOnboarding1,
  "onboarding-2": esOnboarding2,
  "onboarding-3": esOnboarding3,
  home: esHome,
  "my-cards": esMyCards,
  statistics: esStatistics,
  settings: esSettings,
  language: esLanguage,
  profile: esProfile,
  "edit-profile": esEditProfile,
  "list-cards": esListCards,
  "add-card": esAddCard,
  "change-password": esChangePassword,
  "send-money": esSendMoney,
  tabs: esTabs,
};

export const screenResources = { en, fr, es } satisfies Record<
  Locale,
  Record<(typeof SCREEN_NAMESPACES)[number], Record<string, string>>
>;

export const resources: Resource = {
  en: { translation: en, ...en },
  fr: { translation: fr, ...fr },
  es: { translation: es, ...es },
};

export function loadLocaleResources(locale: Locale) {
  return screenResources[locale];
}

export default resources;
