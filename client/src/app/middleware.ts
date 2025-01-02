import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken');

    if (!accessToken) {
        // Перенаправляем на страницу логина, если токен отсутствует
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Проверка токена (можно также добавить проверку срока действия токена)
        const payload = JSON.parse(
            Buffer.from(accessToken.value.split('.')[1], 'base64').toString('utf-8')
        );

        // Проверка истечения срока действия токена
        if (payload.exp * 1000 < Date.now()) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    } catch (error) {
        console.error('Ошибка в middleware:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

// Применяем middleware только к защищённым маршрутам
export const config = {
    matcher: ['/dashboard/:path*'],
};
