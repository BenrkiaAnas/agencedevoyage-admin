import {Categorie} from '../categorie/categorie';
import {PhotoModel} from '../photo.model';

export class VoyageOrganise {

  id?: number;
  reference?: string;
  title?: string;
  description?: any;
  destination?: string;
  visible?: boolean;
  Categories?: any[];
  photos?: PhotoModel[];
  activer?: boolean;
  constructor() {
  }

}
