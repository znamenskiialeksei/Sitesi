import { LanguageProvider } from '../utils/language';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

// Главный компонент, оборачивающий все страницы провайдером языка и стилями
function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
export default MyApp;
