import { InjectionToken } from '@angular/core';

export interface PopoutData {
  modalName: string;
  id: number;
  name: string;
  age?: number;
  employer?: string;
  founded?: string;
  employeeCount?: string;
  description?: string;
}

export const POPOUT_MODAL_DATA = new InjectionToken<PopoutData>('POPOUT_MODAL_DATA');

export enum PopoutModalName {
  'employerDetail' = 'EMPLOYER_DETAIL'
}

export let POPOUT_MODALS = {
  EMPLOYER_DETAIL: {}
};