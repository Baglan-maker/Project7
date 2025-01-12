export const formStyles = {
    maxWidth: { xs: 280, sm: 400 },
    mx: "auto",
    mt: { xs: 3, sm: 6 },
    p: { xs: 2, sm: 4 },
    border: "1px solid #E0E0E0",
    borderRadius: 2,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
};

export const typographyStyles = {
    mb: { xs: 2.5, sm: 4 },
    textAlign: "center",
    fontSize: { xs: "1rem", sm: "1.5rem" },
};

export const alertStyles = {
    mb: 1.5,
    fontSize: { xs: "0.75rem", sm: "1rem" },
};

export const textFieldStyles = {
    mt: { xs: 0.6, sm: 1.5 },
    "& .MuiInputBase-root": {
        fontSize: { xs: "0.875rem", sm: "1rem" },
    },
    "& .MuiFormHelperText-root": {
        fontSize: "0.75rem",
    },
    fontSize: { xs: "0.875rem", sm: "1rem" },
};

export const captchaBoxStyles = {
    mt: 1,
    mb: 1.5,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "& > div": {
        width: { xs: "100%", sm: "auto" },
        transform: { xs: "scale(0.85)", sm: "scale(1)" },
        transformOrigin: "center",
        display: "flex",
        justifyContent: "center",
    },
};

export const buttonStyles = {
    mt: { xs: 0.8, sm: 2.5 },
    py: { xs: 1, sm: 1.5 },
    fontSize: { xs: "0.84rem", sm: "1rem" },
};

// Стили текста с кнопкой "Войти"
export const loginTextStyles = {
    fontSize: { xs: "0.75rem", sm: "0.9rem" },
};

export const loginButtonStyles = {
    fontSize: { xs: "0.75rem", sm: "0.9rem" },
};

export const loginFormStyles = {
    maxWidth: { xs: 320, sm: 400 },
    mx: "auto",
    mt: { xs: 4, sm: 8 },
    p: { xs: 2, sm: 4 },
    border: "1px solid #E0E0E0",
    borderRadius: 2,
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
};

export const loginTypographyStyles = {
    textAlign: "center",
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
    mb: { xs: 1.5, sm: 2.8 },
};

// Стили уведомления для "Войти"
export const loginAlertStyles = {
    mb: 2,
    fontSize: { xs: "0.875rem", sm: "1rem" },
};

// Стили кнопки для "Войти"
export const authLoginButtonStyles = {
    mt: 1.3,
    py: { xs: 1, sm: 1.5 },
};

// Стили текста с кнопкой "Регистрация"
export const registerTextStyles = {
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
};

export const registerButtonStyles = {
    fontSize: { xs: "0.8rem", sm: "0.9rem" },
};

export const wrapperStyles = {
    padding: '1rem',
    maxWidth: '900px',
    margin: '0 auto',
    marginTop: '40px'
};

export const containerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    maxWidth: "600px", // Ограничение ширины
    margin: "0 auto", // Центровка для десктопа
    padding: "0 16px", // Внутренние отступы для мобильных устройств
    fontFamily: "'Roboto', sans-serif",
    textAlign: "center",
};

// Стили для Typography (заголовок)
export const homeTypographyStyles = {
    color: "#333",
    mb: 2,
    fontSize: { xs: "2rem", sm: "2.8rem" }, // Адаптивный размер текста
};

export const boxStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    flexWrap: "wrap", // Для адаптации на мобильных
    gap: "8px", // Промежуток между элементами
    marginRight: "15px",
};

// Стили для Link (ссылки)
export const linkStyles = {
    textDecoration: "none",
    color: "#1976d2",
    fontWeight: 500,
    fontSize: { xs: "1rem", sm: "1.2rem" }, // Адаптивный размер текста
};

// Стили для Typography (разделитель |)
export const dividerStyles = {
    mx: 1,
    fontSize: { xs: "1rem", sm: "1.2rem" }, // Адаптивный размер
};

export const containerStylesDash = {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: '#f4f6f8',
    borderRadius: 2,
    boxShadow: 2,
    textAlign: 'center',
};

export const welcomeTextStyles = {
    fontWeight: 'bold',
    color: '#ff4810',
    marginBottom: 2,
};

export const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    gap: 1.5,
    marginY: 3,
};

export const buttonOutlinedStyles = {
    padding: '6px 12px',
    fontSize: '14px',
    borderColor: '#6c757d',
    color: '#6c757d',
    '&:hover': {
        backgroundColor: '#ff4810',
        borderColor: '#ff4810',
        color: '#fff',
    },
    '&:active': {
        backgroundColor: '#ff4810',
        borderColor: '#ff4810',
        color: '#fff',
    },
};

export const userListStyles = {
    marginTop: 3,
    textAlign: 'left',
};


