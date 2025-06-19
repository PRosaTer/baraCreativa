import { FAQItem, faqData } from "@/app/data/faqData"; 

/**
 * Verifica si un texto contiene una palabra clave exacta.
 * @param text
 * @param keyword
 * @returns
 */
export const hasKeyword = (text: string, keyword: string): boolean => {
  const regex = new RegExp(`\\b${keyword}\\b`, "i");
  return regex.test(text);
};

/**
 * Busca una respuesta en las FAQ basada en el input del usuario.
 * @param input
 * @returns
 */
export const findFaqAnswer = (input: string): FAQItem | null => {
  const lowerInput = input.toLowerCase();

  for (const faq of faqData) {
    for (const keyword of faq.keywords) {
      if (hasKeyword(lowerInput, keyword)) {
        return faq;
      }
    }
  }
  return null;
};