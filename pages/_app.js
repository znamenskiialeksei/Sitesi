import { LanguageProvider } from '../utils/language';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
export default MyApp;
