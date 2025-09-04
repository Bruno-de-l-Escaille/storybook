import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "../../common/components/modal/provider";
import { BookAIList } from "./BookAIList";
import ModalManagerContainer from "../../common/components/modal/modal-manager/modal-manager-container";
import { MemoryRouter } from "react-router-dom";
import { number, object, select, text } from "@storybook/addon-knobs";

const queryClient = new QueryClient();

const user = {
  type: "ADMIN",
  id: 469322,
  firstName: "Emmanuel",
  lastName: "Degrève",
  mainEmail: "emmanuel.degreve@degandpartners.com",
  avatarUrl:
    "https://s3.tamtam.pro/production/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
  language: "fr",
  mainPhone: "+32486210211",
};

export default {
  title: "BookAIList",
  component: BookAIList,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <MemoryRouter initialEntries={["/"]}>
            <Story />
            <ModalManagerContainer />
          </MemoryRouter>
        </ModalProvider>
      </QueryClientProvider>
    ),
  ],
};

export const Default = () => (
  <BookAIList
    language={select("language", ["fr", "nl", "en"], "fr")}
    organization={number("organization", 4442)}
    token={text("token", "e3475338f7675027825ca9924fda22931784fc0e")}
    user={object("user", user)}
    env={text("env", "staging")}
  />
);
