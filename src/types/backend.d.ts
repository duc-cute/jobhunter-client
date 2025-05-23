export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IModelPaginate<T> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

export interface IAccount {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    address: string;
    gender: string;
    age: int;
    company?: ICompany | undefined;
    role: {
      id: string;
      name: string;
      permissions: {
        id: string;
        name: string;
        apiPath: string;
        method: string;
        module: string;
      }[];
    };
  };
}

export interface IChangePassword {
  currentPass: string;
  newPass: string;
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface ICompany {
  id?: string;
  name?: string;
  address?: string;
  logo: string;
  description?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISkill {
  id?: string;
  name?: string;
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  role?: {
    id: string;
    name: string;
  };

  company?: {
    id: string;
    name: string;
  };
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserUpdate {
  name: string;
  age: number;
  gender: string;
  address: string;
}

export interface IHrRegister {
  age: number;
  companyAddress: string;
  companyName: string;
  emailRegister: string;
  fullName: string;
  gender: string;
  permanentAddress: string;
  position: string;
  active?: boolean;
  id?: string | number;
  companyId?: string | number;
}

export interface IJob {
  id?: string;
  name: string;
  skills: ISkill[];
  company?:
    | {
        id: string;
        name: string;
        logo?: string;
      }
    | ICompany;
  location: string;
  salary: number;
  quantity: number;
  level: string;
  description: string;
  startDate: Date;
  endDate: Date;
  active: boolean;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISEARCHJOB {
  pageIndex: number | 1;
  pageSize: number | 10;
  companyId?: string;
  name?: string;
  location?: string;
  active?: boolean;
  skills?: string;
}

export interface IResume {
  id?: string;
  email: string;
  userId: string;
  url: string;
  status: string;
  companyId:
    | string
    | {
        id: string;
        name: string;
        logo: string;
      };
  jobId:
    | string
    | {
        id: string;
        name: string;
      };
  history?: {
    status: string;
    updatedAt: Date;
    updatedBy: { id: string; email: string };
  }[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPermission {
  id?: string;
  name?: string;
  apiPath?: string;
  method?: string;
  module?: string;

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id?: string;
  name: string;
  description: string;
  active: boolean;
  permissions: IPermission[] | string[];

  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISubscribers {
  id?: string;
  name?: string;
  email?: string;
  skills: string[];
  createdBy?: string;
  isDeleted?: boolean;
  deletedAt?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDashBoard {
  users: number;
  jobs: number;
  cvs: number;
  companies: number;
  listReportCompany: [];
}

export interface IRangeTime {
  fromDate: Date;
  toDate: Date;
}
