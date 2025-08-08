export interface PageOptions {
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PaginateDefault {
    page: number;
    size: number
}

export const updatePageOptions = (
  setter: React.Dispatch<React.SetStateAction<PageOptions>>,
  res: PageOptions
) => {
  setter({ ...res });
};