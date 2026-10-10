import type { CvType } from './model';
import type { es } from './locales/es';

export interface CvTypeDefinition {
  id: CvType;
  icon: 'graduation' | 'briefcase' | 'sparkles' | 'layers' | 'book' | 'globe' | 'code' | 'palette';
  nameKey: keyof typeof es;
  descriptionKey: keyof typeof es;
  bestForKey: keyof typeof es;
  photoRecommended: boolean;
}

/**
 * Structures and presentation approaches based on university career guidance.
 * Harvard and European designs are original adaptations, not official documents.
 * Sources: Harvard MCS /resources/create-a-strong-resume/; MIT CAPD
 * /resources/resumes/, /resources/cvs/; europass.europa.eu/en/create-europass-cv.
 * A photograph is always optional; conventions depend on the destination country.
 */
export const CV_TYPES: readonly CvTypeDefinition[] = [
  {
    id: 'harvard', icon: 'graduation',
    nameKey: 'cvTypeNameHarvard', descriptionKey: 'cvTypeDescriptionHarvard', bestForKey: 'cvTypeBestForHarvard',
    photoRecommended: false,
  },
  {
    id: 'chronological', icon: 'briefcase',
    nameKey: 'cvTypeNameChronological', descriptionKey: 'cvTypeDescriptionChronological', bestForKey: 'cvTypeBestForChronological',
    photoRecommended: false,
  },
  {
    id: 'functional', icon: 'sparkles',
    nameKey: 'cvTypeNameFunctional', descriptionKey: 'cvTypeDescriptionFunctional', bestForKey: 'cvTypeBestForFunctional',
    photoRecommended: false,
  },
  {
    id: 'combination', icon: 'layers',
    nameKey: 'cvTypeNameCombination', descriptionKey: 'cvTypeDescriptionCombination', bestForKey: 'cvTypeBestForCombination',
    photoRecommended: false,
  },
  {
    id: 'academic', icon: 'book',
    nameKey: 'cvTypeNameAcademic', descriptionKey: 'cvTypeDescriptionAcademic', bestForKey: 'cvTypeBestForAcademic',
    photoRecommended: false,
  },
  {
    id: 'european', icon: 'globe',
    nameKey: 'cvTypeNameEuropean', descriptionKey: 'cvTypeDescriptionEuropean', bestForKey: 'cvTypeBestForEuropean',
    photoRecommended: false,
  },
  {
    id: 'technical', icon: 'code',
    nameKey: 'cvTypeNameTechnical', descriptionKey: 'cvTypeDescriptionTechnical', bestForKey: 'cvTypeBestForTechnical',
    photoRecommended: false,
  },
  {
    id: 'creative', icon: 'palette',
    nameKey: 'cvTypeNameCreative', descriptionKey: 'cvTypeDescriptionCreative', bestForKey: 'cvTypeBestForCreative',
    photoRecommended: false,
  },
];

export function getCvType(id: CvType): CvTypeDefinition {
  return CV_TYPES.find(type => type.id === id) ?? CV_TYPES[1];
}
