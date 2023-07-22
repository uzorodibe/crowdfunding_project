export interface ICreateCampaign {
  amount: string;
  date: number;
  image: string;
  title: string;
  minAmount: string;
  description: string;
}

export interface IRegisterUser {
  email: string;
  password: string;
  category: string;
}
export interface ILoginUser {
  email: string;
  password: string;
}
export interface IDonateToCampaign {
  campaignId: string;
}
export interface IGetInvestorDonations {
  campaignId: string;
}
