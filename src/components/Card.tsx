import styled from "@emotion/native";
import { useState } from "react";
import {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Svg,
  Text as SvgText,
} from "react-native-svg";

export type CardBrand = "visa" | "mastercard";

export interface CardProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  brand?: CardBrand;
  showContactless?: boolean;
  accessibilityLabel?: string;
  contactlessAccessibilityLabel?: string;
  testID?: string;
}

const cardAspectRatio = 348 / 199;

const CardFrame = styled.View({
  aspectRatio: cardAspectRatio,
  overflow: "hidden",
  position: "relative",
  width: "100%",
});

const ArtworkLayer = styled.View({
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
});

const NetworkArtworkLayer = styled(ArtworkLayer)<{ brand: CardBrand }>(
  ({ brand }) => ({
    bottom: brand === "mastercard" ? "6%" : "11%",
    left: brand === "mastercard" ? "74.2%" : "71%",
    right: brand === "mastercard" ? "-2.7%" : "5.7%",
    top: brand === "mastercard" ? "72.1%" : "75%",
    transform: brand === "visa" ? [{ scale: 0.87 }] : undefined,
  }),
);

const DetailsOverlay = styled.View({
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
});

const CardNumberText = styled.View({
  flexDirection: "row",
  justifyContent: "space-between",
  left: "5.7%",
  position: "absolute",
  right: "5.7%",
  top: "36%",
});

const CardNumberSectionText = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#FFFFFF",
  fontFamily: "Poppins-Medium",
  fontSize: 26 * scale,
  letterSpacing: 1.25 * scale,
  lineHeight: 24 * scale,
}));

const CardholderNameText = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#FFFFFF",
  fontFamily: "Poppins-Regular",
  fontSize: 14 * scale,
  left: "5.7%",
  letterSpacing: 0.6 * scale,
  lineHeight: 18 * scale,
  position: "absolute",
  top: "54%",
}));

const ExpiryLabel = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#A2A2A7",
  fontFamily: "Poppins-Regular",
  fontSize: 8 * scale,
  left: "5.7%",
  letterSpacing: 0.4 * scale,
  lineHeight: 12 * scale,
  position: "absolute",
  top: "70%",
}));

const ExpiryDateText = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#FFFFFF",
  fontFamily: "Poppins-Regular",
  fontSize: 14 * scale,
  left: "5.7%",
  lineHeight: 18 * scale,
  position: "absolute",
  top: "81%",
}));

const CvvLabel = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#A2A2A7",
  fontFamily: "Poppins-Regular",
  fontSize: 8 * scale,
  left: "30%",
  letterSpacing: 0.4 * scale,
  lineHeight: 12 * scale,
  position: "absolute",
  top: "70%",
}));

const CvvText = styled.Text<{ scale: number }>(({ scale }) => ({
  color: "#FFFFFF",
  fontFamily: "Poppins-Regular",
  fontSize: 14 * scale,
  left: "30%",
  lineHeight: 18 * scale,
  position: "absolute",
  top: "81%",
}));

const FeatureLayer = styled.View({
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
});

function BaseCardArtwork() {
  return (
    <Svg
      accessible={false}
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 348 199"
      width="100%"
    >
      <Rect
        fill="#27233D"
        height="198"
        rx="25"
        stroke="#35314A"
        strokeWidth="1"
        width="347"
        x="0.5"
        y="0.5"
      />
      <Rect
        fill="#313052"
        height="198"
        opacity="0.24"
        rx="25"
        width="347"
        x="0.5"
        y="0.5"
      />
      <Chip />
    </Svg>
  );
}

function Chip() {
  return (
    <G testID="card-chip">
      <Rect
        fill="#3C4E92"
        height="25"
        rx="4"
        stroke="#27233D"
        strokeWidth="1.5"
        width="35"
        x="20"
        y="22"
      />
      <Line
        stroke="#27233D"
        strokeLinecap="round"
        strokeWidth="1.5"
        x1="21"
        x2="54"
        y1="32"
        y2="32"
      />
      <Line
        stroke="#27233D"
        strokeLinecap="round"
        strokeWidth="1.5"
        x1="21"
        x2="54"
        y1="37"
        y2="37"
      />
      <Path
        d="M31.5 32L37 25L42.5 32M31.5 37L37 44L42.5 37"
        fill="#3C4E92"
        stroke="#27233D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </G>
  );
}

function ContactlessArtwork() {
  return (
    <Svg accessible={false} height="100%" viewBox="0 0 348 199" width="100%">
      <G fill="none" stroke="#707070" strokeLinecap="round" strokeWidth="2">
        <Path d="M300 29C302 31 302 34 300 36" />
        <Path d="M305 26C308 30 308 35 305 39" />
        <Path d="M310 21C315 28 315 37 310 44" />
        <Path d="M315 17C322 26 322 39 315 48" />
      </G>
    </Svg>
  );
}

function VisaLogo() {
  return (
    <Svg accessible={false} height="100%" viewBox="0 0 44 13" width="100%">
      <Path
        d="M43.2851 12.7408C42.892 12.7408 42.5723 12.4356 42.5723 12.0604C42.5723 11.6848 42.892 11.3792 43.2851 11.3792C43.6781 11.3792 43.9979 11.6848 43.9979 12.0604C43.9979 12.4356 43.6781 12.7408 43.2851 12.7408ZM43.2841 11.5438C42.9859 11.5438 42.7433 11.776 42.7433 12.0613C42.7433 12.3462 42.9859 12.5779 43.2841 12.5779C43.5829 12.5779 43.826 12.3462 43.826 12.0613C43.826 11.776 43.5829 11.5438 43.2841 11.5438ZM43.1888 12.3603L43.1877 12.3602L43.043 12.3593V11.7607H43.3076C43.3587 11.7607 43.4167 11.7607 43.4669 11.7914C43.5164 11.8251 43.5461 11.8809 43.5461 11.9407C43.5461 12.0119 43.504 12.0727 43.439 12.0956L43.5526 12.3579L43.3904 12.3593L43.2959 12.1226H43.1888V12.3593V12.3603Z"
        fill="#FFFFFF"
      />
      <Path
        d="M33.5538 12.7848L29.9639 12.7842L35.1011 1.16064C35.1042 1.15143 35.4261 0.225586 36.6923 0.225586H39.4607L42.218 12.783L39.0557 12.7842L38.6516 10.9194H34.2722L33.5538 12.7848ZM37.0748 3.64099L35.2658 8.3418H38.0936L37.0748 3.64099Z"
        fill="#FFFFFF"
      />
      <Path
        d="M30.233 3.24453L30.725 0.547514C30.725 0.547514 29.2075 0 27.6265 0C25.9167 0 21.8568 0.709207 21.8568 4.15759C21.8568 7.40265 26.6223 7.44321 26.6223 9.14605C26.6223 10.85 22.3482 10.5458 20.9369 9.47104L20.4253 12.2903C20.4253 12.2903 21.963 13 24.3143 13C26.6645 13 30.2122 11.8441 30.2122 8.70046C30.2122 5.43512 25.4039 5.13041 25.4039 3.71093C25.4039 2.29092 28.7594 2.47342 30.233 3.24453Z"
        fill="#FFFFFF"
      />
      <Path
        d="M18.3023 12.7843H14.8574L17.0102 0.225586H20.4562L18.3023 12.7843Z"
        fill="#FFFFFF"
      />
      <Path
        d="M10.1839 12.7842H6.59473L3.60303 1.87628C4.1362 2.17828 4.64325 2.5144 5.11151 2.87427C7.47772 4.69153 8.27625 6.98145 8.28403 7.00439L8.67374 8.86377L11.9578 0.225586H15.6658L10.1839 12.7842Z"
        fill="#FFFFFF"
      />
      <Path
        d="M8.28628 7.00388L7.12694 1.35637C7.12694 1.35637 6.98751 0.225586 5.49308 0.225586H0.063533L0 0.437975C0 0.437975 2.61048 0.951336 5.11356 2.87404C7.50702 4.71296 8.28628 7.00388 8.28628 7.00388Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function MasterCardLogo() {
  return (
    <Svg accessible={false} height="100%" viewBox="0 0 82 36" width="100%">
      <Circle cx="29" cy="15" fill="#EA001B" r="13" />
      <Circle cx="45" cy="15" fill="#F79F1A" r="13" />
      <SvgText
        fill="#FFFFFF"
        fontFamily="Poppins-Regular"
        fontSize="5"
        letterSpacing="0.2"
        textAnchor="middle"
        x="37"
        y="34"
      >
        mastercard
      </SvgText>
    </Svg>
  );
}

function NetworkLogo({ brand }: { readonly brand: CardBrand }) {
  return (
    <FeatureLayer
      accessible
      accessibilityLabel={brand === "visa" ? "Visa logo" : "MasterCard logo"}
      testID={`card-${brand}-logo`}
    >
      <NetworkArtworkLayer brand={brand}>
        {brand === "visa" ? <VisaLogo /> : <MasterCardLogo />}
      </NetworkArtworkLayer>
    </FeatureLayer>
  );
}

export function Card({
  cardNumber,
  cardholderName,
  expiryDate,
  cvv,
  brand,
  showContactless = false,
  accessibilityLabel = "Payment card",
  contactlessAccessibilityLabel = "Contactless payment",
  testID = "payment-card",
}: Readonly<CardProps>) {
  const [cardWidth, setCardWidth] = useState(0);
  const scale = cardWidth > 0 ? cardWidth / 348 : 1;
  const cardNumberSections = cardNumber.trim().split(/\s+/);

  return (
    <CardFrame
      accessible
      accessibilityLabel={accessibilityLabel}
      onLayout={({ nativeEvent }) => setCardWidth(nativeEvent.layout.width)}
      testID={testID}
    >
      <ArtworkLayer>
        <BaseCardArtwork />
      </ArtworkLayer>

      {showContactless ? (
        <FeatureLayer
          accessible
          accessibilityLabel={contactlessAccessibilityLabel}
          testID="card-contactless"
        >
          <ContactlessArtwork />
        </FeatureLayer>
      ) : null}

      {brand ? <NetworkLogo brand={brand} /> : null}

      <DetailsOverlay pointerEvents="none">
        <CardNumberText testID="card-number">
          {cardNumberSections.map((section, index) => (
            <CardNumberSectionText
              key={`${section}-${index}`}
              scale={scale}
              testID={`card-number-section-${index}`}
            >
              {section}
            </CardNumberSectionText>
          ))}
        </CardNumberText>
        <CardholderNameText scale={scale}>
          {cardholderName}
        </CardholderNameText>
        <ExpiryLabel scale={scale}>
          Expiry Date
        </ExpiryLabel>
        <ExpiryDateText scale={scale}>
          {expiryDate}
        </ExpiryDateText>
        <CvvLabel scale={scale}>
          CVV
        </CvvLabel>
        <CvvText scale={scale}>
          {cvv}
        </CvvText>
      </DetailsOverlay>
    </CardFrame>
  );
}
