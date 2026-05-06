import React from "react";
import GoPeopleAuthHeader from "./index";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: "GoPeopleAuthHeader",
  component: GoPeopleAuthHeader,
  decorators: [StoryRouter(), withKnobs],
};

const apiBaseUrl = text("API Base URL", "http://localhost:8080");

export const DefaultGoPeopleAuthHeader = () => {
  const appName = text("App Name", "tamtam");
  const language = select("Language", ["fr", "nl", "en"], "fr");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng={language}
      app={{
        name: appName,
      }}
      onSuccess={(data) => {
        console.log("Authentication successful:", data);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
      onClose={() => {
        console.log("Modal closed");
      }}
    />
  );
};

export const GoPeopleAuthHeaderEnglish = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="en"
    onSuccess={(data) => {
      console.log("Authentication successful:", data);
      alert(
        `Authentication successful! Token: ${data.token.substring(0, 20)}...`
      );
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
    }}
  />
);

export const GoPeopleAuthHeaderDutch = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="nl"
    onSuccess={(data) => {
      console.log("Authentication successful:", data);
      alert(
        `Authentication successful! Token: ${data.token.substring(0, 20)}...`
      );
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
    }}
  />
);

export const GoPeopleAuthHeaderWithCustomAPI = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="fr"
    onSuccess={(data) => {
      // Custom success handler - could store token in localStorage
      localStorage.setItem("authToken4555", data.token);
      console.log("Token stored in localStorage");
      alert("Authentication successful! Token stored.");
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
      alert(`Authentication failed: ${error.message}`);
    }}
  />
);

export const GoPeopleAuthHeaderInHeaderContext = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
    }}
  >
    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>My Application</div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>Navigation</span>
      <GoPeopleAuthHeader
        apiBaseUrl={apiBaseUrl}
        lng="fr"
        onSuccess={(data) => {
          console.log("User authenticated in header:", data);
          alert("Welcome! You are now logged in.");
        }}
        onError={(error) => {
          console.error("Authentication error:", error);
        }}
      />
    </div>
  </div>
);

// Story to test different app_name values for OTP branding
export const WithDifferentAppBranding = () => {
  const appName = text("App Name for Branding", "ua");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng="fr"
      app={{
        name: appName,
      }}
      onSuccess={(data) => {
        console.log("Authentication successful with custom branding:", data);
        alert(`Authentication successful with ${appName} branding!`);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
    />
  );
};

// Story to test different language values for OTP email content
export const WithDifferentLanguages = () => {
  const language = select("Email Content Language", ["fr", "en", "nl"], "en");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng={language}
      app={{
        name: "tamtam",
      }}
      onSuccess={(data) => {
        console.log("Authentication successful:", data);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
    />
  );
};

// Comprehensive story combining all OTP parameters
export const OTPFlowWithCustomParameters = () => {
  const appName = text("App Name (for OTP logo)", "tamtam");
  const language = select(
    "Language (for UI & OTP email)",
    ["fr", "en", "nl"],
    "fr"
  );
  const apiBaseUrl = text("API Base URL", "https://peopleapi.tamtam.pro");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test OTP Flow with Custom Parameters</h2>
      <p>
        This story demonstrates how the OTP email will be customized based on
        app_name and language.
      </p>
      <ul>
        <li>
          <strong>app_name:</strong> Controls the logo branding in the OTP email
        </li>
        <li>
          <strong>language:</strong> Controls the email content language (fr,
          en, nl)
        </li>
      </ul>
      <GoPeopleAuthHeader
        apiBaseUrl={apiBaseUrl}
        lng={language}
        app={{
          name: appName,
        }}
        onSuccess={(data) => {
          console.log("Authentication successful:", data);
          alert("Authentication successful! Check console for details.");
        }}
        onError={(error) => {
          console.error("Authentication error:", error);
          alert(`Error: ${error.message}`);
        }}
        onClose={() => {
          console.log("Modal closed");
        }}
      />
    </div>
  );
};
