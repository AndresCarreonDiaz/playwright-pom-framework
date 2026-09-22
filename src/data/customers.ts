export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const defaultCustomer: Customer = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  postalCode: '64000',
};
