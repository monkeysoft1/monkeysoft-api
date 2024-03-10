import AppError from "./AppError";

export default class Utils {
  static hasChanges(input: Object, old: any) {
    const hasChange = Object.keys(input).some((k) => {
      const haveProperty = Object.keys(input).some((k) => old?.[k] && k);

      const isChanging = input[k as keyof typeof input] !== old[k as keyof typeof old];

      return haveProperty && isChanging;
    });

    if (!hasChange) {
      throw new AppError("Nenhuma alteração realizada", 400);
    }
  }

  static stringIsEmpty(value: any, required = false): boolean {
    const isString = typeof value === "string";
    const isUndefined = typeof value === "undefined";

    if (required && (!isString || !value.trim())) {
      return true;
    }

    if (!isUndefined && (!isString || !value.trim())) {
      return true;
    }

    return false;
  }

  static numberIsEmpty(value: any, required = false): boolean {
    const isNumber = !Number.isNaN(value);
    const isUndefined = typeof value === "undefined";

    if (required && !isNumber) {
      return true;
    }

    if (!isUndefined && !isNumber) {
      return true;
    }

    return false;
  }
}
