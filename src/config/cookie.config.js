
const isProduction = process.env.NODE_ENV === 'production';
export const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
};


