interface ImageInfo {
  icon_url: string;
  medium_url: string;
  screen_url: string;
  screen_large_url: string;
  small_url: string;
  super_url: string;
  thumb_url: string;
  tiny_url: string;
  original_url: string;
  image_tags: string;
}

interface ImageTag {
  api_detail_url: string;
  name: string;
  total: number;
}

interface VideoInfo {
  api_detail_url: string;
  id: number;
  name: string;
  site_detail_url: string;
}

export interface GameInfo {
  aliases: string | null;
  deck: string;
  description: string;
  image: ImageInfo;
  image_tags: ImageTag[];
  name: string;
  number_of_user_reviews: number;
  original_release_date: string;
  videos: VideoInfo[];
}
