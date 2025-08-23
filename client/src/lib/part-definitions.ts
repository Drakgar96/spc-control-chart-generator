import { PartDefinition } from '@/types/spc';

export const PART_IMAGES = {
  'default': null,
  'axle-profile': 'https://lh3.googleusercontent.com/d/10pDdEq7ur5BwYiKwR0L9uYyQphysJlbN',
  'lamella-profile': 'https://lh3.googleusercontent.com/d/1d_96kHTQjRFqNrPrAeeMe037KgnXfwL0',
  'rh-side-profile': 'https://lh3.googleusercontent.com/d/1fs3C2Le43kl2u4qQ30xu-23iEm3kFqzG',
  'lh-side-profile': 'https://lh3.googleusercontent.com/d/1CC0puIR6yfMEh6G4cXjOePl08qrlV0zH',
  'lid-profile': 'https://lh3.googleusercontent.com/d/13fDJNLHItmOlOAGYOqbjG5DfjHheTlWw',
  'front-profile': 'https://lh3.googleusercontent.com/d/1spCqCtuj73d20YLhg9qbtNVsPp8qdnMp',
  'rear-profile': 'https://lh3.googleusercontent.com/d/1P5IWM78GxsqczU0deiLGB46Mw7WGBFZz'
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
  'lamella-profile': {
    name: 'Lamella Profile HY10 - 123 257',
    characteristics: [
      {name: 'Width Measurement', type: 'variable', initialValues: { subgroupSize: '4', usl: '80.3', lsl: '79.7', nominalValue: '80.0', data: '80.1, 80.0, 79.9, 80.2\n79.8, 80.1, 80.0, 79.9\n80.2, 80.1, 79.8, 80.0\n80.0, 79.9, 80.1, 80.2\n79.9, 80.0, 80.1, 79.8' }},
      {name: 'Surface Quality Check', type: 'attribute', initialValues: { subgroupSize: '150', usl: null, lsl: null, nominalValue: null, data: '150,2\n150,1\n150,3\n150,2\n150,1\n150,0\n150,2\n150,3\n150,1\n150,2' }}
    ]
  },
  'rh-side-profile': {
    name: 'RH Side Profile HY10 - 142 942',
    characteristics: [
      {name: 'Height Dimension', type: 'variable', initialValues: { subgroupSize: '3', usl: '95.4', lsl: '94.6', nominalValue: '95.0', data: '95.1, 94.9, 95.0\n95.2, 94.8, 95.1\n94.9, 95.0, 95.2\n95.0, 94.7, 95.1\n95.1, 95.0, 94.9' }},
      {name: 'Angle Verification', type: 'variable', initialValues: { subgroupSize: '3', usl: '46.0', lsl: '44.0', nominalValue: '45.0', data: '45.2, 44.8, 45.0\n45.1, 44.9, 45.3\n44.7, 45.0, 45.2\n45.0, 44.8, 45.1\n45.2, 45.0, 44.9' }}
    ]
  },
  'lh-side-profile': {
    name: 'LH Side Profile HY10 - 142 943',
    characteristics: [
      {name: 'Height Dimension', type: 'variable', initialValues: { subgroupSize: '3', usl: '95.4', lsl: '94.6', nominalValue: '95.0', data: '94.8, 95.2, 95.0\n95.1, 94.9, 95.0\n95.0, 94.7, 95.1\n94.9, 95.1, 95.2\n95.0, 94.8, 95.1' }},
      {name: 'Angle Verification', type: 'variable', initialValues: { subgroupSize: '3', usl: '46.0', lsl: '44.0', nominalValue: '45.0', data: '44.9, 45.1, 45.0\n45.2, 44.8, 45.0\n45.0, 45.3, 44.7\n45.1, 44.9, 45.2\n44.8, 45.0, 45.1' }}
    ]
  },
  'lid-profile': {
    name: 'Lid Profile HY10 - 142 421',
    characteristics: [
      {name: 'Outer Diameter', type: 'variable', initialValues: { subgroupSize: '4', usl: '120.3', lsl: '119.7', nominalValue: '120.0', data: '120.1, 119.9, 120.0, 120.2\n119.8, 120.1, 120.0, 119.9\n120.0, 119.8, 120.2, 120.1\n120.1, 120.0, 119.9, 120.0\n119.9, 120.2, 120.0, 119.8' }},
      {name: 'Inner Diameter', type: 'variable', initialValues: { subgroupSize: '4', usl: '110.2', lsl: '109.8', nominalValue: '110.0', data: '110.1, 109.9, 110.0, 110.1\n109.9, 110.0, 110.1, 109.8\n110.0, 109.9, 110.1, 110.0\n110.1, 110.0, 109.9, 110.0\n109.8, 110.1, 110.0, 109.9' }},
      {name: 'Concentricity Check', type: 'attribute', initialValues: { subgroupSize: '100', usl: null, lsl: null, nominalValue: null, data: '100,1\n100,0\n100,2\n100,1\n100,0\n100,1\n100,2\n100,0\n100,1\n100,1' }}
    ]
  },
  'front-profile': {
    name: 'Front Profile HY10 - 142 408',
    characteristics: [
      {name: 'Overall Length', type: 'variable', initialValues: { subgroupSize: '5', usl: '200.6', lsl: '199.4', nominalValue: '200.0', data: '200.2, 199.8, 200.0, 200.1, 199.9\n200.0, 199.7, 200.2, 200.1, 199.8\n199.9, 200.1, 200.0, 199.8, 200.2\n200.1, 199.9, 200.0, 200.2, 199.7\n200.0, 200.1, 199.8, 199.9, 200.2' }},
      {name: 'Mounting Hole Diameter', type: 'variable', initialValues: { subgroupSize: '5', usl: '8.1', lsl: '7.9', nominalValue: '8.0', data: '8.0, 7.9, 8.1, 8.0, 7.9\n8.1, 8.0, 7.9, 8.0, 8.1\n7.9, 8.0, 8.1, 8.0, 7.9\n8.0, 8.1, 7.9, 8.0, 8.1\n8.1, 7.9, 8.0, 8.0, 7.9' }},
      {name: 'Assembly Clearance', type: 'attribute', initialValues: { subgroupSize: '50', usl: null, lsl: null, nominalValue: null, data: '50,1\n50,0\n50,2\n50,1\n50,0\n50,1\n50,0\n50,2\n50,1\n50,0' }}
    ]
  },
  'rear-profile': {
    name: 'Rear Profile HY10 - 142 221',
    characteristics: [
      {name: 'Overall Width', type: 'variable', initialValues: { subgroupSize: '4', usl: '180.5', lsl: '179.5', nominalValue: '180.0', data: '180.1, 179.9, 180.0, 180.2\n179.8, 180.1, 180.0, 179.7\n180.0, 179.9, 180.2, 180.1\n180.1, 180.0, 179.8, 179.9\n179.9, 180.2, 180.0, 179.8' }},
      {name: 'Step Height', type: 'variable', initialValues: { subgroupSize: '4', usl: '15.2', lsl: '14.8', nominalValue: '15.0', data: '15.0, 14.9, 15.1, 15.0\n14.8, 15.1, 15.0, 14.9\n15.0, 14.9, 15.2, 15.1\n15.1, 15.0, 14.8, 14.9\n14.9, 15.2, 15.0, 14.8' }},
      {name: 'Surface Finish', type: 'attribute', initialValues: { subgroupSize: '75', usl: null, lsl: null, nominalValue: null, data: '75,1\n75,2\n75,0\n75,1\n75,1\n75,0\n75,2\n75,1\n75,0\n75,1' }}
    ]
  }
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
