import { calculationMethods } from '../calculations';

// Calculation types for UI
export const calculationTypes = {
  NAZAROV_SIPACHEV: 'nazarov-sipachev',
  SIPACHEV_POSEVICH: 'sipachev-posevich',
  MAKSIMOV: 'maksimov',
  SAZONOV: 'sazonov',
  PIRVERDYAN: 'pirverdyan',
  KAMBAROV: 'kambarov'
};

export function calculate(data, type, options = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Нет данных для вычисления');
  }

  console.log('Calculating with type:', type);
  console.log('Input data:', data);

  const calculateMethod = calculationMethods[type];
  if (!calculateMethod) {
    throw new Error('Неизвестный метод вычисления');
  }

  try {
    return calculateMethod(data, options);
  } catch (error) {
    console.error('Error in calculation method:', error);
    throw new Error('Ошибка при вычислении: ' + error.message);
  }
}
