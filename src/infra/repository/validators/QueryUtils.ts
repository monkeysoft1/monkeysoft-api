export default class QueryUtils {
  static removeUndefined(obj: Object) {
    return Object.entries(obj).filter((f) => f[1] !== undefined);
  }
}
