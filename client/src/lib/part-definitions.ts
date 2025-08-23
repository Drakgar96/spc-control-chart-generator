import { PartDefinition } from '@/types/spc';

export const PART_IMAGES = {
  'default': null,
  'axle-profile': 'https://drive.google.com/thumbnail?id=10pDdEq7ur5BwYiKwR0L9uYyQphysJlbN&sz=w1000',
  'lamella-profile': 'https://drive.google.com/thumbnail?id=1d_96kHTQjRFqNrPrAeeMe037KgnXfwL0&sz=w1000',
  'rh-side-profile': 'https://drive.google.com/thumbnail?id=1fs3C2Le43kl2u4qQ30xu-23iEm3kFqzG&sz=w1000',
  'lh-side-profile': 'https://drive.google.com/thumbnail?id=1CC0puIR6yfMEh6G4cXjOePl08qrlV0zH&sz=w1000',
  'lid-profile': 'https://drive.google.com/thumbnail?id=13fDJNLHItmOlOAGYOqbjG5DfjHheTlWw&sz=w1000',
  'front-profile': 'https://drive.google.com/thumbnail?id=1spCqCtuj73d20YLhg9qbtNVsPp8qdnMp&sz=w1000',
  'rear-profile': 'https://drive.google.com/thumbnail?id=1P5IWM78GxsqczU0deiLGB46Mw7WGBFZz&sz=w1000'
};

export const PART_CONFIGS: Record<string, { name: string; characteristics: { name: string; type: string; initialValues: any }[] }> = {
  'default': {
    name: 'Custom Characteristics',
    characteristics: [
      {
        name: 'Variable Characteristic',
        type: 'variable',
        initialValues: { subgroupSize: '4', usl: '1253.5', lsl: '1252.5', nominalValue: '1253', data: '1252.98, 1252.88, 1252.78, 1252.97\n1252.6, 1249.19, 1252.77, 1253.19\n1253.1, 1252.89, 1253, 1253\n1252.9, 1252.88, 1253.1, 1253.38\n1253.12, 1252.64, 1252.8, 1252.88\n1252.66, 1252.57, 1252.62, 1252.5' }
      },
      {
        name: 'Attribute Characteristic',
        type: 'attribute',
        initialValues: { subgroupSize: '100', usl: null, lsl: null, nominalValue: null, data: '100,5\n100,6\n100,4\n100,3\n100,7\n100,6\n100,5\n100,8\n100,4\n100,5' }
      }
    ]
  },
  'axle-profile': {
    name: 'Axle Profile HY10 - 148 253',
    characteristics: [
      {name: 'Measured Length',type: 'variable',initialValues: { subgroupSize: '5', usl: '1253.5', lsl: '1252.5', nominalValue: '1253', data: '1253.1, 1253.2, 1253.0, 1253.8, 1253.3\n1253.9, 1253.1, 1253.0, 1253.2, 1253.1\n1253.3, 1253.4, 1253.1, 1253.9, 1253.0\n1253.0, 1253.2, 1253.3, 1253.7, 1253.1\n1253.2, 1253.9, 1253.0, 1253.1, 1253.2' }},
      {name: 'Surface free and straight edges',type: 'attribute',initialValues: { subgroupSize: '200', usl: null, lsl: null, nominalValue: null, data: '200,3\n200,4\n200,2\n200,5\n200,3\n200,4\n200,3\n200,6\n200,2\n200,3' }},
      {name: 'No burrs on the edges',type: 'attribute',initialValues: { subgroupSize: '200', usl: null, lsl: null, nominalValue: null, data: '200,1\n200,0\n200,1\n200,2\n200,0\n200,1\n200,1\n200,0\n200,2\n200,1' }}
    ]
  },
  // Additional part configurations can be added here
};

export const partDefinitions: Record<string, PartDefinition> = {
  'axle-profile': {
    name: 'Axle Profile HY10 - 148 253',
    image: PART_IMAGES['axle-profile']!,
    characteristics: [
      { name: 'Length (A)', nominal: 150.0, upperTol: 0.5, lowerTol: -0.5, unit: 'mm' },
      { name: 'Diameter (B)', nominal: 25.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' },
      { name: 'Surface Roughness', nominal: 1.6, upperTol: 0.4, lowerTol: -0.4, unit: 'μm' }
    ]
  },
  'lamella-profile': {
    name: 'Lamella Profile HY10 - 123 257',
    image: PART_IMAGES['lamella-profile']!,
    characteristics: [
      { name: 'Width (C)', nominal: 80.0, upperTol: 0.3, lowerTol: -0.3, unit: 'mm' },
      { name: 'Thickness (D)', nominal: 12.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' },
      { name: 'Flatness', nominal: 0.05, upperTol: 0.02, lowerTol: -0.02, unit: 'mm' }
    ]
  },
  'rh-side-profile': {
    name: 'RH Side Profile HY10 - 142 942',
    image: PART_IMAGES['rh-side-profile']!,
    characteristics: [
      { name: 'Height (E)', nominal: 95.0, upperTol: 0.4, lowerTol: -0.4, unit: 'mm' },
      { name: 'Angle (F)', nominal: 45.0, upperTol: 1.0, lowerTol: -1.0, unit: '°' }
    ]
  },
  'lh-side-profile': {
    name: 'LH Side Profile HY10 - 142 943',
    image: PART_IMAGES['lh-side-profile']!,
    characteristics: [
      { name: 'Height (G)', nominal: 95.0, upperTol: 0.4, lowerTol: -0.4, unit: 'mm' },
      { name: 'Angle (H)', nominal: 45.0, upperTol: 1.0, lowerTol: -1.0, unit: '°' }
    ]
  },
  'lid-profile': {
    name: 'Lid Profile HY10 - 142 421',
    image: PART_IMAGES['lid-profile']!,
    characteristics: [
      { name: 'Outer Diameter (I)', nominal: 120.0, upperTol: 0.3, lowerTol: -0.3, unit: 'mm' },
      { name: 'Inner Diameter (J)', nominal: 110.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' },
      { name: 'Concentricity', nominal: 0.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' }
    ]
  },
  'front-profile': {
    name: 'Front Profile HY10 - 142 408',
    image: PART_IMAGES['front-profile']!,
    characteristics: [
      { name: 'Overall Length (K)', nominal: 200.0, upperTol: 0.6, lowerTol: -0.6, unit: 'mm' },
      { name: 'Mounting Hole Dia.', nominal: 8.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' }
    ]
  },
  'rear-profile': {
    name: 'Rear Profile HY10 - 142 221',
    image: PART_IMAGES['rear-profile']!,
    characteristics: [
      { name: 'Overall Width (L)', nominal: 180.0, upperTol: 0.5, lowerTol: -0.5, unit: 'mm' },
      { name: 'Step Height (M)', nominal: 15.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' }
    ]
  }
};
