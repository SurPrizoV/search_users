import s from "./Header.module.css";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export const Header = ({ responseData, setResponseData }) => {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("desc");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const myLink = `https://api.github.com/search/users?q=${value}`;
    try {
      const response = await fetch(myLink);
      if (response.ok) {
        setResponseData(await response.json());
      } else if (response.status === 422) {
        console.log("Ошибка: проверка не удалась или точка была заспамлена");
      } else if (response.status === 503) {
        console.log("Ошибка: сервис недоступен");
      } else if (response.status === 304) {
        console.log("Ошибка: не изменено");
      } else {
        console.log("Неизвестная ошибка");
      }
    } catch (error) {
      console.log("Ошибка:", error.message);
    }
  };

  const handleFilter = async (event) => {
    event.preventDefault();
    desc === "desc" ? setDesc("asc") : setDesc("desc");
    const filterLink = `https://api.github.com/search/users?q=${value}&sort=repositories&order=${desc}`;
    try {
      const response = await fetch(filterLink);
      if (response.ok) {
        setResponseData(await response.json());
      }
    } catch (error) {
      console.log("Ошибка:", error.message);
    }
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
    </>
  );
};
