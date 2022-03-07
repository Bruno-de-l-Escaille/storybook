import axios from "axios";

export const getNotifications = ({
  apiUrl,
  token,
  userId,
  navCommunity,
  appName,
  loggedAsAdmin,
  options,
}) => {
  let filter = [
    {
      property: "status",
      value: "PUBLISHED",
      operator: "eq",
    },
    {
      property: "appName",
      value: appName,
      operator: "like",
    },
  ];
  if (navCommunity) {
    filter.push({
      property: "folder",
      value: navCommunity.id,
      operator: "eq",
    });
  } else {
    filter.push({
      property: "folder",
      value: "",
      operator: "null",
    });
  }

  let fields = ["*", "isRead", "introduction"];
  let sort = [
    {
      property: "publishedAt",
      dir: "desc",
    },
  ];

  const requestUrl = `${apiUrl}/blog/notification-user/${userId}`;

  let params = {
    access_token: token,
    filter: JSON.stringify(filter),
    fields: fields.join(","),
    sort: JSON.stringify(sort),
    limit: options && options.limit ? options.limit : 10,
  };
  if (loggedAsAdmin) {
    params.is_admin = 1;
  }

  return axios.get(requestUrl, {
    params,
  });
};
