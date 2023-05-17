import { useState, useEffect } from "react";
import s from "./List.module.css";

export const List = ({ responseData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeId, setActiveId] = useState(null);
  const [userCounts, setUserCounts] = useState({});
  const [sortBy, setSortBy] = useState("asc");

  const onActiveChange = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  useEffect(() => {
    if (!responseData) return;

    const fetchCounts = async () => {
      const countPromises = responseData.items.map(async ({ login }) => {
        const response = await fetch(`https://api.github.com/users/${login}`);
        const user = await response.json();
        return {
          id: user.id,
          repos: user.public_repos,
          followers: user.followers,
        };
      });

      const counts = await Promise.all(countPromises);
      const countsObject = counts.reduce(
        (obj, { id, ...counts }) => ({ ...obj, [id]: counts }),
        {}
      );
      setUserCounts(countsObject);
    };

    fetchCounts();
  }, [responseData]);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(responseData?.items?.length / itemsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  const sortedItems = responseData?.items?.sort((a, b) => {
    const aCount = userCounts[a.id]?.repos || 0;
    const bCount = userCounts[b.id]?.repos || 0;
    if (sortBy === "asc") return aCount - bCount;
    else return bCount - aCount;
  });

  return (
    <>
      <button
        className={s.button}
        onClick={() => setSortBy(sortBy === "asc" ? "desc" : "asc")}
      >
        {sortBy === "asc"
          ? "Сортировать по убыванию"
          : "Сортировать по возрастанию"}
      </button>
      <div className={s.list}>
        {sortedItems
          ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((item) => (
            <div
              className={s.user}
              id={item.id}
              key={item.id}
              onClick={() => onActiveChange(item.id)}
            >
              <img src={item.avatar_url} alt="avatar" className={s.avatar} />
              <p className={s.login}>{item.login}</p>
              {activeId === item.id ? (
                <div className={s.info}>
                  <p>Кол-во репозиториев: {userCounts[item.id]?.repos}</p>
                  <p>Кол-во подписчиков: {userCounts[item.id]?.followers}</p>
                </div>
              ) : null}
            </div>
          ))}
      </div>
      <div className={s.pagination}>
        {pageNumbers.map((number) => (
          <button
            className={s.pag_button}
            key={number}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </>
  );
};
