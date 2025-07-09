import React from "react";
import GoPeopleAuthHeader from "./index";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: "GoPeopleAuthHeader",
  component: GoPeopleAuthHeader,
  decorators: [StoryRouter(), withKnobs],
};

export const DefaultGoPeopleAuthHeader = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={text("API Base URL", "http://localhost:8080")}
    lng={select("Language", ["fr", "nl", "en"], "fr")}
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

export const GoPeopleAuthHeaderEnglish = () => (
  <GoPeopleAuthHeader
    apiBaseUrl="http://localhost:8080"
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
    apiBaseUrl="http://localhost:8080"
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
    apiBaseUrl="https://api.gopeople.com"
    lng="fr"
    onSuccess={(data) => {
      // Custom success handler - could store token in localStorage
      localStorage.setItem("authToken", data.token);
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
        apiBaseUrl="http://localhost:8080"
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
