import '@testing-library/jest-dom';
// jsdom de CRA 4 no expone Web Crypto; se usa la implementación de Node en pruebas.
Object.defineProperty(window, 'crypto', { value: require('crypto').webcrypto });
