import React from "react";
import { Container, Typography, Link, Box } from "@mui/material";
import {boxStyles, containerStyles, dividerStyles, homeTypographyStyles, linkStyles} from "@/app/styles/form-styles";

export default function Home() {
    return (
        <main>
            <Container
                component="main"
                sx={containerStyles}>
                <header>
                    <Typography variant="h3" sx={homeTypographyStyles}>
                        Добро Пожаловать
                    </Typography>
                </header>

                <section>
                    <Box sx={boxStyles}>
                        <Link href="/auth/register" sx={linkStyles}>
                            Регистрация
                        </Link>
                        <Typography variant="body1" sx={dividerStyles}>
                            |
                        </Typography>
                        <Link href="/auth/login" sx={linkStyles}>
                            Войти
                        </Link>
                    </Box>
                </section>
            </Container>
        </main>
    );
}
