export type RootStackParamList = {
  '(tabs)': undefined;
  'movie/[id]': { id: string };
  'movie/seat-selection': { movieId: number };
  'modals/video-player': { videoKey: string; title: string };
  '+not-found': undefined;
};

export type TabParamList = {
  index: undefined;
  search: undefined;
  favorites: undefined;
};