export const TRAIL_CURRENT_USER = 'trail_current_user';
export const TRAIL_CURRENT_USER_TOKEN = 'trail_current_user_token';
export const TRAIL_CURRENT_USER_PROFILE = 'trail_current_user_profile';
export const TRAIL_CURRENT_USER_GEOLOCATION = 'trail_current_user_geolocation';

export const TRAIL_STEP_TRAILS = 'trail_step_trails';
export const TRAIL_STEP_PLACES = 'trail_step_places';
export const TRAIL_STEP_PLACES_TYPES = 'trail_step_places_types';

export const TRAIL_STEP_TRAILS_LOADING = 'trail_step_trails_loading';
export const TRAIL_STEP_PLACES_LOADING = 'trail_step_places_loading';
export const TRAIL_STEP_TRAILS_SAVED_LOADING =
  'trail_step_trails_saved_loading';
export const TRAIL_STEP_TRAILS_CREATED_LOADING =
  'trail_step_trails_created_loading';
export const TRAIL_STEP_PLACES_SAVED_LOADING =
  'trail_step_places_saved_loading';

export const TRAIL_STEP_TRAILS_SAVED = 'trail_step_trails_saved';
export const TRAIL_STEP_TRAILS_CREATED = 'trail_step_trails_created';
export const TRAIL_STEP_PLACES_SAVED = 'trail_step_places_saved';

export const TRAIL_STEP_TRAILS_ALL_CREATED = 'trail_step_trails_all_created';
export const TRAIL_STEP_ALL_TRAILS = 'trail_step_all_trails';
export const TRAIL_STEP_ALL_PLACES = 'trail_step_all_places';

export const TRAIL_STEP_ALL_MAP_TRAILS = 'trail_step_all_map_trails';
export const TRAIL_STEP_ALL_MAP_PLACES = 'trail_step_all_map_places';

export const TRAIL_STEP_PLACES_RATINGS = 'trail_step_places_ratings';
export const TRAIL_STEP_TRAILS_RATINGS = 'trail_step_trails_ratings';

export const TRAIL_STEP_ALL_USERS_TRAILS = 'trail_step_all_users_trails';

export const TRAIL_STEP_FILTER = 'trail_step_filters';

export const TRAIL_STEP_SHOW_SUBTYPES = 'trail_step_showPlaceSubTypes';

export const PLACE_SHOW_SUBTYPES = 'place_showPlaceSubTypes';

export const IS_USER_PROFILE_LOADED = 'is_trail_user_profile_loaded';

export const emailValidationRegex =
  '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
export const emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
export const passwordValidationRegex =
  '^((?=.*[0-9])|(?=.*[!@#$%^&*]))[a-zA-Z0-9!@#$%^&*-_+=()]{8,50}$';

export const MAX_ITEMS_PER_PAGE = 10;
export const DEFAULT_LOCATION_REFRESH_INTERVAL = 10;
export const MAX_GEOLOCATION_TIMEOUT = 60000;
export const DEFAULT_DISTANCE_DECIMAL = 1;

export const SAVED_TEXT = 'Saved';
export const ALL_TEXT = 'All';
export const ALL_PLACES = 'All Places';
export const ALL_TRAILS = 'All Trails';
export const ALL_TYPES = 'All Types';
export const ALL_CUISINES = 'All Cuisines';
export const SELECTION_TEXT = 'Selection';
export const PLACE_TEXT = 'Place';
export const TRAIL_TEXT = 'Trail';

export const EPSG_3857 = 'EPSG:3857';
export const EPSG_4326 = 'EPSG:4326';

export const ACCOUNTS_PAGE_TABS = {
  CREATED_TRAILS: {
    label: 'Created Trails',
    value: 'created',
  },
  SAVED_TRAILS: {
    label: 'Saved Trails',
    value: 'trails',
  },
  SAVED_PLACES: {
    label: 'Saved Places',
    value: 'places',
  },
};

export const APP_FEEDBACK: any = [
  {
    id: 1,
    label: 'Suggest a new destination',
  },
  {
    id: 2,
    label: 'Suggest a new feature',
  },
  {
    id: 3,
    label: 'Report a bug or issue',
  },
  {
    id: 4,
    label: 'Other',
  },
];

export const PLACES_FILTERS_ITEM = {
  ALL_PLACES: {
    id: 'all',
    label: 'All Places',
    value: 'all',
  },
  SAVED_PLACES: {
    id: 'saved',
    label: 'Saved Places',
    value: 'saved',
  },
  // CUSTOMIZE_SELECTION: {
  //   id: 'customize',
  //   label: 'Customized Selection',
  //   value: 'customize',
  // },
};

export const PLACES_FILTERS: any = {
  header: null,
  subtitle: null,
  items: [PLACES_FILTERS_ITEM.ALL_PLACES, PLACES_FILTERS_ITEM.SAVED_PLACES],
};

export const TRAIL_THEME: any = [
  { label: 'Nature', id: 'nature', child: [8] }, // [8] -> ['Park']
  { label: 'Culture', id: 'culture', child: [6, 7, 9] }, // [] -> ['Art Gallery', 'Museum', 'Landmark']
  { label: 'Lunch', id: 'lunch', child: [1] }, // [1] -> ['Restaurant']
  { label: 'Dinner', id: 'dinner', child: [1] },
  { label: 'Drinks', id: 'drinks', child: [2] },
  { label: 'Dance', id: 'dance', child: [5] },
  { label: 'Coffee', id: 'coffee', child: [3] },
  { label: 'Pastries', id: 'pastries', child: [4] },
]

export const RATINGS_SORT = {
  HIGH: {
    value: 'ratingDesc',
    label: 'High',
  },
  LOW: {
    value: 'ratingAsc',
    label: 'Low',
  },
};

export const DISTANT_SORT = {
  NEAR: {
    value: 'near',
    label: 'Nearest',
  },
  FAR: {
    value: 'far',
    label: 'Farthest',
  },
};

export const TRAIL_PLACE_SORT_ITEMS = {
  DISTANCE: {
    value: 'distance',
    label: 'By Distance',
    allowOn: ['trails', 'place'],
    subFilters: [DISTANT_SORT.NEAR, DISTANT_SORT.FAR],
  },
  RATING: {
    value: 'rating',
    label: 'By Rating',
    allowOn: ['trails', 'place'],
    subFilters: [RATINGS_SORT.HIGH, RATINGS_SORT.LOW],
  },
  RECENCY: {
    value: 'recency',
    label: 'By Newest',
    allowOn: ['trails'],
    subFilters: null,
  },
};

export const TRAIL_PLACE_SORT_FILTERS = [
  TRAIL_PLACE_SORT_ITEMS.DISTANCE,
  TRAIL_PLACE_SORT_ITEMS.RATING,
  TRAIL_PLACE_SORT_ITEMS.RECENCY,
];

export const TRAIL_FILTERS: any = {
  header: null,
  subtitle: null,
  items: [
    {
      id: 'all',
      label: 'All',
      value: 'all',
    },
    {
      id: 'saved',
      label: 'Saved',
      value: 'saved',
    },
    {
      id: 'created',
      label: 'Created',
      value: 'created',
    },
    {
      id: 'verified',
      label: 'Verified',
      value: 'verified',
    },
  ],
};

export const TRAIL_DETAILS_FILTER_TIME: any = {
  header: 'When',
  subtitle: 'Select the time of your trail',
  items: [
    {
      id: 'daytime',
      label: 'Daytime',
    },
    {
      id: 'evening',
      label: 'Evening',
    },
  ],
};

export const TRAIL_DETAILS_FILTER_WITH: any = {
  header: 'Who',
  subtitle: 'Who are you with',
  items: [
    {
      id: 'solo',
      label: 'Solo',
      value: 'solo',
    },
    {
      id: 'friends',
      label: 'Friends',
      value: 'friends',
    },
    {
      id: 'family',
      label: 'Family',
      value: 'family',
    },
    {
      id: 'dates',
      label: 'Dates',
      value: 'dates',
    },
  ],
};

export const EXPERIENCE_FILTER = [
  {
    id: 1,
    name: 'Ambiance',
    selected: false,
    subfilters: [
      {
        id: 1,
        name: 'Serene',
        selected: false,
      },
      {
        id: 2,
        name: 'Cozy',
        selected: false,
      },
      {
        id: 3,
        name: 'Warm',
        selected: false,
      },
      {
        id: 4,
        name: 'Peaceful',
        selected: false,
      },
      {
        id: 5,
        name: 'Authentic',
        selected: false,
      },
      {
        id: 6,
        name: 'Romantic',
        selected: false,
      },
      {
        id: 7,
        name: 'Homey',
        selected: false,
      },
      {
        id: 8,
        name: 'Enchanting',
        selected: false,
      },
      {
        id: 9,
        name: 'Delightful',
        selected: false,
      },
      {
        id: 10,
        name: 'Mystical',
        selected: false,
      },
      {
        id: 11,
        name: 'Cosmopolitan',
        selected: false,
      },
      {
        id: 12,
        name: 'Accalimed',
        selected: false,
      },
      {
        id: 13,
        name: 'Chic',
        selected: false,
      },
      {
        id: 14,
        name: 'Upscale',
        selected: false,
      },
      {
        id: 15,
        name: 'Distinguised',
        selected: false,
      },
      {
        id: 16,
        name: 'Exclusive',
        selected: false,
      },
      {
        id: 17,
        name: 'Sophisticated',
        selected: false,
      },
      {
        id: 18,
        name: 'Magestic',
        selected: false,
      },
      {
        id: 19,
        name: 'Magical',
        selected: false,
      },
      {
        id: 20,
        name: 'Casual Boring',
        selected: false,
      },
      {
        id: 21,
        name: 'Boring',
        selected: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Surroundings',
    selected: false,
    subfilters: [
      {
        id: 1,
        name: 'Serene',
        selected: false,
      },
      {
        id: 2,
        name: 'Cozy',
        selected: false,
      },
      {
        id: 3,
        name: 'Warm',
        selected: false,
      },
      {
        id: 4,
        name: 'Peaceful',
        selected: false,
      },
      {
        id: 5,
        name: 'Authentic',
        selected: false,
      },
      {
        id: 6,
        name: 'Romantic',
        selected: false,
      },
      {
        id: 7,
        name: 'Homey',
        selected: false,
      },
      {
        id: 8,
        name: 'Enchanting',
        selected: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Crowd',
    selected: false,
    subfilters: [
      {
        id: 11,
        name: 'Cosmopolitan',
        selected: false,
      },
      {
        id: 12,
        name: 'Accalimed',
        selected: false,
      },
      {
        id: 13,
        name: 'Chic',
        selected: false,
      },
      {
        id: 14,
        name: 'Upscale',
        selected: false,
      },
      {
        id: 15,
        name: 'Distinguised',
        selected: false,
      },
      {
        id: 16,
        name: 'Exclusive',
        selected: false,
      },
      {
        id: 17,
        name: 'Sophisticated',
        selected: false,
      },
      {
        id: 18,
        name: 'Magestic',
        selected: false,
      },
      {
        id: 19,
        name: 'Magical',
        selected: false,
      },
      {
        id: 20,
        name: 'Casual Boring',
        selected: false,
      },
      {
        id: 21,
        name: 'Boring',
        selected: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Food and Drinks',
    selected: false,
    subfilters: [
      {
        id: 1,
        name: 'Serene',
        selected: false,
      },
      {
        id: 2,
        name: 'Cozy',
        selected: false,
      },
      {
        id: 3,
        name: 'Warm',
        selected: false,
      },
      {
        id: 4,
        name: 'Peaceful',
        selected: false,
      },
      {
        id: 5,
        name: 'Authentic',
        selected: false,
      },
      {
        id: 6,
        name: 'Romantic',
        selected: false,
      },
      {
        id: 7,
        name: 'Homey',
        selected: false,
      },
      {
        id: 8,
        name: 'Enchanting',
        selected: false,
      },
      {
        id: 9,
        name: 'Delightful',
        selected: false,
      },
      {
        id: 21,
        name: 'Boring',
        selected: false,
      },
    ],
  },
  {
    id: 5,
    name: 'Service',
    selected: false,
    subfilters: [
      {
        id: 1,
        name: 'Serene',
        selected: false,
      },
      {
        id: 2,
        name: 'Cozy',
        selected: false,
      },
      {
        id: 3,
        name: 'Warm',
        selected: false,
      },
      {
        id: 4,
        name: 'Peaceful',
        selected: false,
      },
      {
        id: 5,
        name: 'Authentic',
        selected: false,
      },
      {
        id: 11,
        name: 'Cosmopolitan',
        selected: false,
      },
      {
        id: 12,
        name: 'Accalimed',
        selected: false,
      },
      {
        id: 13,
        name: 'Chic',
        selected: false,
      },
      {
        id: 14,
        name: 'Upscale',
        selected: false,
      },
      {
        id: 15,
        name: 'Distinguised',
        selected: false,
      },
      {
        id: 21,
        name: 'Boring',
        selected: false,
      },
    ],
  },
  {
    id: 6,
    name: 'Cost',
    selected: false,
    subfilters: [
      {
        id: 6,
        name: 'Romantic',
        selected: false,
      },
      {
        id: 7,
        name: 'Homey',
        selected: false,
      },
      {
        id: 8,
        name: 'Enchanting',
        selected: false,
      },
      {
        id: 9,
        name: 'Delightful',
        selected: false,
      },
      {
        id: 10,
        name: 'Mystical',
        selected: false,
      },
      {
        id: 11,
        name: 'Cosmopolitan',
        selected: false,
      },
      {
        id: 12,
        name: 'Accalimed',
        selected: false,
      },
      {
        id: 13,
        name: 'Chic',
        selected: false,
      },
      {
        id: 14,
        name: 'Upscale',
        selected: false,
      },
      {
        id: 21,
        name: 'Boring',
        selected: false,
      },
    ],
  },
];
