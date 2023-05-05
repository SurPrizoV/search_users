import s from "./Header.module.css";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export const Header = ({ setResponseData }) => {
  const [value, setValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const myLink = `https://api.github.com/search/users?q=${value}`;
    const response = await fetch(myLink);
    setResponseData(await response.json());
  };

  return (
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
  );
};
