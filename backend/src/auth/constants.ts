export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  refresh_token:
    'HIs RF DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
  refresh_token_name: 'jid',
  refresh_token_expires_in: '93600000000',
};
const expiresIn: string = jwtConstants.refresh_token_expires_in;
const ttl = parseInt(expiresIn, 10);
export const configCookie = {
  httpOnly: true,
  secure: false,
  expires: new Date(Date.now() + ttl),
  path: '/',
};
