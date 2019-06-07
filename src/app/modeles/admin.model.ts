export class AdminModel {
  id?: any;
  username?: string;
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  isvalid?: boolean;
  role?: string;
  roles?: string;

  setId(id) {
    this.id = id;
  }
}
