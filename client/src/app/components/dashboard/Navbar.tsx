import {AppBar, Box, Container, Toolbar} from '@mui/material';
import LanguageSwitcherDash from "@/app/components/common/LanguageSwitcherDash";

const Navbar = () => {
    return (
        <div>
            <LanguageSwitcherDash  onLanguageChange={(newLocale) => {}}
                style={{ position: 'fixed', zIndex: 2,}}
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
                <Container maxWidth="lg">
                    <Toolbar
                        sx={{
                            justifyContent: 'space-between',
                            paddingX: { xs: 2, md: 3 },
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo_christmas.925c2cb761f2a4c94456.png"
                            alt="Logo"
                            sx={{
                                height: { xs: 38.5, sm: 40 },
                                cursor: 'pointer',
                                position: 'absolute',
                                top: { xs: 9, sm: 13 },
                                left: { xs: 5, sm: 20, md: 30, lg: 0 },
                            }}
                            onClick={() => window.location.href = '/'}
                        />
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
};

export default Navbar;
