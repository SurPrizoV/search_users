import s from "./Header.module.css";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Pagination } from "../Pagination/Pagination";

export const Header = ({ responseData, setResponseData }) => {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("desc");
  const [pageNumber, setPageNumber] = useState("1");

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else if (response.status === 422) {
        console.log("Ошибка: проверка не удалась или точка была заспамлена");
        return {};
      } else if (response.status === 503) {
        console.log("Ошибка: сервис недоступен");
        return {};
      } else if (response.status === 304) {
        console.log("Ошибка: не изменено");
        return {};
      } else {
        console.log("Неизвестная ошибка");
        return {};
      }
    } catch (error) {
      console.log("Ошибка:", error.message);
      return {};
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const myLink = `https://api.github.com/search/users?q=${value}`;
    const responseData = await fetchData(myLink);
    setResponseData(responseData);
  };

  const handleFilter = async (event) => {
    event.preventDefault();
    desc === "desc" ? setDesc("asc") : setDesc("desc");
    const filterLink = `https://api.github.com/search/users?q=${value}&sort=repositories&order=${desc}`;
    const responseData = await fetchData(filterLink);
    setResponseData(responseData);
  };

  const handlePagination = async (event, page) => {
    event.preventDefault();
    setPageNumber(page);
    const paginationLink = `https://api.github.com/search/users?q=${value}&per_page=48&page=${page}`;
    const responseData = await fetchData(paginationLink);
    setResponseData(responseData);
  };

  return (
    <>
      <form className={s.header} onSubmit={handleSubmit}>
        <input
          type="text"
          className={s.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите логин для поиска"
        />
        <button className={s.button} type="submit">
          <IoSearch />
        </button>
      </form>
      <button
        className={responseData ? `${s.button_filter}` : `${s.hidden}`}
        onClick={handleFilter}>
        {desc === "desc"
          ? "Сортировать по возрастанию"
          : "Сортировать по убыванию"}
      </button>
      <Pagination
        responseData={responseData}
        pageNumber={pageNumber}
        handlePagination={handlePagination}
      />
    </>
  );
};
