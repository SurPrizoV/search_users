import s from "./Header.module.css";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export const Header = ({ responseData, setResponseData }) => {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("desc");
  const [page, setPage] = useState(1);

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

  const handleLink = async () => {
    const link = `https://api.github.com/search/users?q=${value}&per_page=48&page=${page}&sort=repositories&order=${desc}`;
    const responseData = await fetchData(link);
    setResponseData(responseData);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLink();
  };

  const handleFilter = async (event) => {
    event.preventDefault();
    desc === "desc" ? setDesc("asc") : setDesc("desc");
    handleLink();
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    handleLink();
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
      <p>
        {desc === "desc"
          ? "Отсортированно по убыванию"
          : "Отсортированно по  возрастанию"}
      </p>
      <button
        className={responseData ? `${s.button_filter}` : `${s.hidden}`}
        onClick={handleFilter}>
        {desc === "desc"
          ? "Сортировать по возрастанию"
          : "Сортировать по убыванию"}
      </button>
      <div className={responseData ? `${s.pagination}` : `${s.hidden}`}>
        <button
          className={s.button_filter}
          onClick={() => handlePageChange(page - 1)}>
          Предыдущая
        </button>
        <p>{page}</p>
        <button
          className={s.button_filter}
          onClick={() => handlePageChange(page + 1)}>
          Следующая
        </button>
      </div>
    </>
  );
};
