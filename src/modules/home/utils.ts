import { inspirationalQuotes } from "./data";

export const getRandomQuote = () => {
  return inspirationalQuotes[
    Math.floor(Math.random() * inspirationalQuotes.length)
  ];
};
