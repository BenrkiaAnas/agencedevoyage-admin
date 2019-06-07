import {Hotel} from '../hotel/hotel';
import {VoyageOrganise} from '../voyage/voyage-organise';
import {Promo} from '../promotion/promo';
import {Inclusion} from '../inclusion/inclusion';

export class Planning {
  id?: number;
  hotel: Hotel;
  voyageOrganise: VoyageOrganise;
  promo: Promo;
  inclusion: Inclusion[] = [];
  reference: string;
  description: string;
  nbrDays: number;
  nbrNight: number;
  nbrPlace: number;
  priceAdult: number;
  priceChild: number;
  dateBegin: string;
  dateEnd: string;
  visible: boolean;
  isActiver: boolean;

  constructor() {
  }

  set(planning: Planning) {
    this.id = planning.id;
    this.hotel = planning.hotel;
    this.voyageOrganise = planning.voyageOrganise;
    this.promo = planning.promo;
    this.setInclusions(planning.inclusion);
    this.reference = planning.reference;
    this.description = planning.description;
    this.nbrDays = planning.nbrDays;
    this.nbrNight = planning.nbrNight;
    this.nbrPlace = planning.nbrPlace;
    this.priceAdult = planning.priceAdult;
    this.priceChild = planning.priceChild;
    this.dateBegin = planning.dateBegin;
    this.dateEnd = planning.dateEnd;
    this.visible = planning.visible;
    this.isActiver = planning.isActiver;
  }

  setInclusions(inclusions: Inclusion[]) {
    if (inclusions.length) {
      for (let elem of inclusions) {
        this.inclusion.push(elem);
      }
    }
  }
}
