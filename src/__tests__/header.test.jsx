import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Header } from "../components/header/header";

test("отображает форму с правильными элементами", () => {
  render(<Header />);
  const inputElement = screen.getByPlaceholderText("Введите логин для поиска");
  const buttonElement = screen.getByRole("button");
  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

test("обновляет входное значение при изменении", () => {
  render(<Header />);
  const inputElement = screen.getByPlaceholderText("Введите логин для поиска");
  fireEvent.change(inputElement, { target: { value: "testuser" } });
  expect(inputElement.value).toBe("testuser");
});

describe("Header component", () => {
  it("извлекает данные из API при отправке и задает запрос данных ответа", async () => {
    const setResponseData = jest.fn();
    const testData = {
      items: [
        {
          login: "testuser",
          id: 123,
          avatar_url: "https://testavatar.com",
        },
      ],
    };

    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(testData),
      })
    );

    render(<Header setResponseData={setResponseData} />);
    const inputElement = screen.getByPlaceholderText(
      "Введите логин для поиска"
    );
    fireEvent.change(inputElement, { target: { value: "test" } });
    fireEvent.submit(screen.getByRole("button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.github.com/search/users?q=test"
      );
      expect(setResponseData).toHaveBeenCalledWith(testData);
    });
  });
});
