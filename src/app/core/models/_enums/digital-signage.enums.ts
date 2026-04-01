export enum MediaContentType {
  Image = 1,
  Video = 2,
  Document = 3,
  PPTX = 4,
  PDF = 5,
}

export type DigitalSignageTabId =
  | 'screens'
  | 'groups'
  | 'content-library'
  | 'scheduler'
  | 'templates'
  | 'instant-control';

export type MediaLibraryFilterType =
  | 'all'
  | 'images'
  | 'videos'
  | 'pdf'
  | 'powerpoint';
