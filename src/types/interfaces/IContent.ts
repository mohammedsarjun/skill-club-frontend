export interface IContentItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  icon: string;
  isPublished: boolean;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface IContentListResponse {
  success: boolean;
  message: string;
  data: {
    data: IContentItem[];
  };
}

export interface IContentResponse {
  success: boolean;
  message: string;
  data?: IContentItem;
}

export interface IUpdateContentRequest {
  slug: string;
  title: string;
  content: string;
  icon: string;
  isPublished: boolean;
}
