import { z } from "zod";

export const getValidationSchema = (t: (key: string) => string) => {
    return z.object({
        iin: z
            .string()
            .regex(/^\d{12}$/, t("ИИН должен содержать 12 цифр"))
            .nonempty(t("ИИН обязателен")),
        fullName: z
            .string()
            .regex(
                /^[a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+$/,
                t("Введите полное имя и фамилию")
            )
            .nonempty(t("ФИО обязательно"))
            .transform((value) =>
                value
                    .split(" ")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
            ),
        birthDate: z
            .string()
            .nonempty(t("Дата рождения обязательна"))
            .refine(
                (date) => {
                    const parsedDate = new Date(date);
                    const minDate = new Date("1930-01-01");
                    return parsedDate >= minDate && parsedDate <= new Date();
                },
                { message: t("Дата должна быть в диапазоне с 1930 года до сегодняшнего дня") }
            ),
        city: z.string().nonempty(t("Город обязателен")),
        password: z
            .string()
            .min(8, t("Пароль должен содержать минимум 8 символов"))
            .regex(/[A-Z]/, t("Пароль должен содержать хотя бы одну заглавную букву"))
            .regex(/\d/, t("Пароль должен содержать хотя бы одну цифру"))
            .nonempty(t("Пароль обязателен"))
            .refine(
                (password) => !password.includes(" "),
                { message: t("Пароль не должен содержать пробелов") }
            )
            .refine(
                (password) => !/[а-яА-ЯёЁ]/.test(password),
                { message: t("Пароль не должен содержать кириллицу") }
            ),
        email: z.string().email().nonempty()
    });
};

export const loginValidationSchema = (t: (key: string) => string) => z.object({
    iin: z.string().regex(/^\d{12}$/, t("ИИН должен содержать 12 цифр")).nonempty(t("ИИН обязателен")),
    password: z
        .string()
        .min(8, t("Пароль должен содержать минимум 8 символов"))
        .regex(/[A-Z]/, t("Пароль должен содержать хотя бы одну заглавную букву"))
        .regex(/\d/, t("Пароль должен содержать хотя бы одну цифру"))
        .nonempty(t("Пароль обязателен"))
        .refine((password) => !password.includes(" "), { message: t("Пароль не должен содержать пробелов") })
        .refine((password) => !/[а-яА-ЯёЁ]/.test(password), { message: t("Пароль не должен содержать кириллицу") }),
});
