import AppError from './AppError';

export default class Utils {
  static hasChanges(input: Object, old: Object) {
    const hasChange = Object.keys(input).some((k) => {
      const haveProperty = Boolean(old[k as keyof typeof old]);
      const isChanging = input[k as keyof typeof input] !== old[k as keyof typeof old];

      return haveProperty && isChanging
    });

    if (!hasChange) {
      throw new AppError('Nenhuma alteração realizada', 400);
    }
  }

  static stringIsEmpty(value: any): boolean {
    if (typeof value !== 'string' || !value.trim()) {
      return true;
    }
    return false;
  }
}
