import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').FlatConfig[]} */
export default [
  {
    files: ["client/**/*.ts", "client/**/*.tsx"], // Клиентские файлы
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module", // Для import/export
      globals: {
        ...globals.browser, // Глобальные переменные браузера
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: pluginReact,
    },
    rules: {
      "no-alert": "error", // Запрещает alert
      "semi": ["error", "always"], // Требует точку с запятой
      "eqeqeq": "error", // Требует строгого сравнения
      "no-unused-vars": ["error", { vars: "all", args: "none" }], // Запрещает неиспользуемые переменные
      "@typescript-eslint/no-unused-vars": ["error"], // Для TypeScript
      "no-console": ["warn", { allow: ["warn", "error"] }], // Разрешает console.warn и console.error
    },
  },
  {
    files: ["server/**/*.js"], // Серверные файлы
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script", // Для require/exports
      globals: {
        ...globals.node, // Глобальные переменные Node.js
      },
    },
    rules: {
      "strict": "off", // Требует глобального строгого режима
      "no-unused-vars": ["warn", { vars: "all", args: "none" }], // Предупреждает о неиспользуемых переменных
      "semi": ["error", "always"], // Требует точки с запятой
      "no-console": "off", // Разрешает использование console.log
      "eqeqeq": "error", // Требует строгого сравнения
      "no-process-exit": "warn", // Предупреждает о вызове process.exit()
      "callback-return": "error", // Требует вызова обратных функций в Node.js
      "handle-callback-err": ["error", "^(err|error)$"], // Обработка ошибок в коллбэках
      "no-buffer-constructor": "error", // Запрещает использование Buffer() конструктора
    },
  },
];
