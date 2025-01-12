import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useAuthGuard } from '@/app/context/authGuard';

const SessionExpiredDialog = () => {
    const { showModal, handleLogout, setShowModal } = useAuthGuard();

    const handleContinue = () => {
        setShowModal(false);
    };

    return (
        <Dialog open={showModal} onClose={handleContinue}>
            <DialogTitle>Срок действия сессии истёк</DialogTitle>
            <DialogContent>
                <p>Продолжить или выйти?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleContinue} color="primary">Продолжить</Button>
                <Button onClick={handleLogout} color="secondary">Выйти</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionExpiredDialog;
