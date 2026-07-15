export type PaymentMethod = {
  id: string;
  label: string;
  number: string;
  holderName: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "dana",
    label: "DANA",
    number: "085337374016",
    holderName: "AYLIRA NATASYA SUSANTO",
  },
  {
    id: "seabank",
    label: "SeaBank",
    number: "901375396187",
    holderName: "AYLIRA NATASYA SUSANTO",
  },
  {
    id: "bca",
    label: "BCA",
    number: "0562106586",
    holderName: "AYLIRA NATASYA SUSANTO",
  },
];
