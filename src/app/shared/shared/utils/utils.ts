import { IonContent } from "@ionic/angular";

export const trackById = (_: number, item: any): number => {
    return item.id;
  }

export const errorImage = (event): void => {
  event.target.src = '../../../../assets/images/image_not_found.png';
}

export const emptyObject = (object: any): boolean => {
  return Object.keys(object || {})?.length > 0 ? true : false
}

export const gotToTop = (content: IonContent): void => {
  content.scrollToTop(500);
}



