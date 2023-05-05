import { Header } from "../../components/Header/Header";
import { List } from "../../components/List/List";
import { useState } from "react";

export const Main = () => {
  const [responseData, setResponseData] = useState("");
  return (
    <>
      <Header responseData={responseData} setResponseData={setResponseData} />
      <List responseData={responseData} />
    </>
  );
};
