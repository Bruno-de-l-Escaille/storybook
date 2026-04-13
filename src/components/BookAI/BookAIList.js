import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { BookAIListComponent } from "./BookAIListComponent";

// Create a client instance
const queryClient = new QueryClient();

export const BookAIList = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/"]}>
        <BookAIListComponent {...props} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};
