import { PlaceTypesEffects } from '../../modules/main/store/PlaceTypes/PlaceTypes.effects';
import { AuthEffects } from '../../modules/auth/store/auth.effects';
import { MainEffects } from '../../modules/main/store/main.effects';
import { PlacesEffects } from '../../modules/main/store/Places/Places.effects';
import { BookmarkTrailsEffects } from '../../modules/main/store/BookmarkTrails/BookmarkTrails.effects';
import { BookmarkPlacesEffects } from './../../modules/main/store/BookmarkPlaces/BookmarkPlaces.effects';

export const effectsList = [
  AuthEffects,
  MainEffects,
  PlaceTypesEffects,
  PlacesEffects,
  BookmarkPlacesEffects,
  BookmarkTrailsEffects,
];
