import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "../../common/components/modal/provider";
import { BookAIList } from "./BookAIList";
import ModalManagerContainer from "../../common/components/modal/modal-manager/modal-manager-container";
import { MemoryRouter } from "react-router-dom";

const queryClient = new QueryClient();

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
    language="fr"
    organization={4442}
    token={"bd25a275aef6b1a3e013a1900ae7f19589e9785e"}
    user={{
      type: "ADMIN",
      id: 8650,
      firstName: "Emmanuel",
      lastName: "Degrève",
      mainEmail: "emmanuel.degreve@degandpartners.com",
      avatarUrl:
        "https://s3.tamtam.pro/production/storage/media/IMAGE/31/AVATAR_70d83b21836dec24e6ec10e5d38a0ac3d96cbed2.png",
      language: "fr",
      mainPhone: "+32486210211",
    }}
  />
);
