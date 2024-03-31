import Session from "../entity/Session";

export default interface ISessionRepository {
  save(id_user: string, user: Session): Promise<void>;
}
