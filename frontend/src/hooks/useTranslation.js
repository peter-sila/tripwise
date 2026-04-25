import { useLanguage } from './LanguageContext';
import { getTranslation } from '../utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  return (key) => getTranslation(key, language);
};
