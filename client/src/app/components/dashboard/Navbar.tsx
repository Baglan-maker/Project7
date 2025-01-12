import React from 'react';
import { AppBar, Box, Toolbar } from '@mui/material';
import LanguageSwitcherDash from "@/app/components/common/LanguageSwitcherDash";

const Navbar = () => {
    return (
        <div>
            <LanguageSwitcherDash
                style={{
                    position: 'fixed',
                    top: '45px',
                    right: '100px',
                    zIndex: 9999,
                }}
            />
            <AppBar
                position="fixed"
                sx={{
                    width: "100%",
                    zIndex: 1,
                    top: 0,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        paddingX: 2,
                    }}
                >
                    <Box
                        component="img"
                        src="/logo_christmas.925c2cb761f2a4c94456.png"
                        alt="Logo"
                        sx={{
                            height: 40, // Высота логотипа
                            cursor: 'pointer',
                            marginLeft: { xs: 1, sm: 20 },
                        }}
                        onClick={() => window.location.href = '/'}
                    />
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;
