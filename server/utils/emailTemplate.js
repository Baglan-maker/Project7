
const passwordResetTemplate = (resetLink, expirationMinutes) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #333;">Сброс пароля</h2>
        <p>Вы запросили сброс пароля для вашего аккаунта. Для сброса пароля нажмите на кнопку ниже:</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Сбросить пароль</a>
        </div>
        <p>Токен для сброса пароля действует <strong>${expirationMinutes} минут</strong>.</p>
        <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.</p>
        <p style="color: #555; font-size: 14px;">С уважением,<br>Команда поддержки</p>
    </div>
`;

module.exports = { passwordResetTemplate };
