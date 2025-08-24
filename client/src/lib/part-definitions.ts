import { PartDefinition } from '@/types/spc';

export const PART_IMAGES = {
  'default': null,
  'axle-profile': 'https://lh3.googleusercontent.com/d/10pDdEq7ur5BwYiKwR0L9uYyQphysJlbN',
  'lamella-profile': 'https://lh3.googleusercontent.com/d/1d_96kHTQjRFqNrPrAeeMe037KgnXfwL0',
  'rh-side-profile': 'https://lh3.googleusercontent.com/d/1fs3C2Le43kl2u4qQ30xu-23iEm3kFqzG',
  'lh-side-profile': 'https://lh3.googleusercontent.com/d/1CC0puIR6yfMEh6G4cXjOePl08qrlV0zH',
  'lid-profile': 'https://lh3.googleusercontent.com/d/13fDJNLHItmOlOAGYOqbjG5DfjHheTlWw',
  'front-profile': 'https://lh3.googleusercontent.com/d/1spCqCtuj73d20YLhg9qbtNVsPp8qdnMp',
  'rear-profile': 'https://lh3.googleusercontent.com/d/1P5IWM78GxsqczU0deiLGB46Mw7WGBFZz',
  'pull-force': null
};

export const PART_CONFIGS: Record<string, { name: string; characteristics: { name: string; type: string; initialValues: any }[] }> = {
  'default': {
    name: 'Custom Characteristics',
    characteristics: [
      {
        name: 'Variable Characteristic',
        type: 'variable',
        initialValues: { subgroupSize: '4', usl: '0.5', lsl: '-0.5', nominalValue: '1253', data: '1252.98, 1252.88, 1252.78, 1252.97\n1252.6, 1249.19, 1252.77, 1253.19\n1253.1, 1252.89, 1253, 1253\n1252.9, 1252.88, 1253.1, 1253.38\n1253.12, 1252.64, 1252.8, 1252.88\n1252.66, 1252.57, 1252.62, 1252.5' }
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
      {name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '5', usl: '0.5', lsl: '-0.5', nominalValue: '1253', data: '1253.1, 1253.2, 1253.0, 1253.8, 1253.3\n1253.9, 1253.1, 1253.0, 1253.2, 1253.1\n1253.3, 1253.4, 1253.1, 1253.9, 1253.0\n1253.0, 1253.2, 1253.3, 1253.7, 1253.1\n1253.2, 1253.9, 1253.0, 1253.1, 1253.2' }},
      {name: 'Surface free and straight edges', type: 'attribute', initialValues: { subgroupSize: '200', usl: null, lsl: null, nominalValue: null, data: '200,3\n200,4\n200,2\n200,5\n200,3\n200,4\n200,3\n200,6\n200,2\n200,3' }},
      {name: 'No burrs on the edges', type: 'attribute', initialValues: { subgroupSize: '200', usl: null, lsl: null, nominalValue: null, data: '200,1\n200,0\n200,1\n200,2\n200,0\n200,1\n200,1\n200,0\n200,2\n200,1' }}
    ]
  },
  'lamella-profile': {
    name: 'Lamella Profile HY10 - 123 257',
    characteristics: [
      {name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', usl: '1', lsl: '-1', nominalValue: '1257', data: '1257.01, 1257.05, 1257.98, 1257.02\n1257.03, 1257.99, 1257.01, 1257.00\n1257.04, 1257.06, 1257.00, 1257.02\n1257.97, 1257.00, 1257.01, 1257.03' }},
      {name: 'Surface dent free and paint covered', type: 'attribute', initialValues: { subgroupSize: '150', usl: null, lsl: null, nominalValue: null, data: '150,2\n150,1\n150,3\n150,2\n150,1\n150,2\n150,0\n150,3\n150,1\n150,2' }},
      {name: 'Fix 332 Lamella Thread', type: 'attribute', initialValues: { subgroupSize: '150', usl: null, lsl: null, nominalValue: null, data: '150,0\n150,1\n150,0\n150,0\n150,0\n150,1\n150,0\n150,0\n150,1\n150,0' }}
    ]
  },
  'rh-side-profile': {
    name: 'RH Side Profile HY10 - 142 942',
    characteristics: [
      { name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '1188.5', usl: '0.7', lsl: '-0.7', data: '1188.6, 1188.5, 1188.4, 1188.7\n1188.5, 1188.8, 1188.5, 1188.6\n1188.4, 1188.3, 1188.6, 1188.5\n1188.7, 1188.6, 1188.5, 1188.4' } },
      { name: 'Final Lock Slot to Flush Cut Distance (Q. E1)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '78', usl: '0.3', lsl: '-0.3', data: '78.1, 78.0, 78.2, 77.9\n78.0, 78.1, 78.1, 78.0\n78.2, 78.1, 78.0, 78.1\n78.0, 77.9, 78.1, 78.2' } },
      { name: 'Middle Lock Slot Width (Q. F4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '14.8', usl: '0.1', lsl: '-0.1', data: '14.82, 14.80, 14.81, 14.79\n14.80, 14.83, 14.80, 14.81\n14.78, 14.80, 14.81, 14.82\n14.80, 14.79, 14.80, 14.81' } },
      { name: 'Middle Lock Slot Height (Q. F4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '8', usl: '0.2', lsl: '-0.2', data: '8.05, 8.10, 8.00, 7.95\n8.02, 8.05, 8.01, 7.99\n8.10, 8.08, 8.05, 8.02\n8.00, 7.98, 8.01, 8.03' } },
      { name: 'Final Lock Slot Width (Q. F2)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '28', usl: '0.2', lsl: '-0.2', data: '28.1, 28.0, 28.2, 27.9\n28.0, 28.1, 28.1, 28.0\n27.9, 28.0, 28.1, 28.2\n28.0, 27.9, 28.0, 28.1' } },
      { name: 'Final Lock Slot Height Location Distance (Q. F2)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '15.1', usl: '0.2', lsl: '-0.2', data: '15.15, 15.10, 15.12, 15.08\n15.11, 15.14, 15.10, 15.13\n15.05, 15.09, 15.10, 15.11\n15.10, 15.12, 15.11, 15.09' } },
      { name: 'Final Lock Slot to Rear Side Distance (Q. F1)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '50', usl: '0.3', lsl: '-0.3', data: '50.1, 50.0, 50.2, 49.9\n50.0, 50.1, 50.1, 50.0\n49.9, 50.0, 50.1, 50.2\n50.0, 49.9, 50.0, 50.1' } },
      { name: 'Distance between Final and Middle Lock Slots (Q. E3)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '377.2', usl: '0.5', lsl: '-0.5', data: '377.3, 377.1, 377.4, 377.0\n377.2, 377.5, 377.1, 377.3\n377.0, 377.2, 377.3, 377.4\n377.1, 377.3, 377.2, 377.0' } },
      { name: 'Machined Slot Width for Carpet Width (Q. E7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '160.9', usl: '0.5', lsl: '-0.5', data: '160.9, 161.0, 160.8, 160.9\n161.0, 161.1, 160.9, 160.8\n160.7, 160.9, 161.0, 161.1\n160.9, 160.8, 160.9, 161.0' } },
      { name: 'Machined Slot for Canister Hole (Q. C7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '36', usl: '0.3', lsl: '-0.3', data: '36.1, 36.0, 36.2, 35.9\n36.0, 36.1, 36.1, 36.0\n35.9, 36.0, 36.1, 36.2\n36.0, 35.9, 36.0, 36.1' } },
      { name: 'Machined Slot for Canister Hole (Q. C6)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '36', usl: '0.3', lsl: '-0.3', data: '36.1, 36.0, 36.2, 35.9\n36.0, 36.1, 36.1, 36.0\n35.9, 36.0, 36.1, 36.2\n36.0, 35.9, 36.0, 36.1' } },
      { name: 'Machined Slot Height for Canister Hole (Q. C7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '16', usl: '0.2', lsl: '-0.2', data: '16.1, 16.0, 16.2, 15.9\n16.0, 16.1, 16.1, 16.0\n15.9, 16.0, 16.1, 16.2\n16.0, 15.9, 16.0, 16.1' } },
      { name: 'Surface Free of Dents, Scratches and/or Metal Shavings', type: 'attribute', initialValues: { subgroupSize: '200', data: '200,2\n200,3\n200,1\n200,4\n200,2\n200,3\n200,2\n200,1\n200,3\n200,2' } },
      { name: 'Channel Validation Tool Sliding', type: 'attribute', initialValues: { subgroupSize: '200', data: '200,0\n200,1\n200,0\n200,0\n200,1\n200,0\n200,0\n200,1\n200,0\n200,0' } }
    ]
  },
  'lh-side-profile': {
    name: 'LH Side Profile HY10 - 142 943',
    characteristics: [
      { name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '1188.5', usl: '0.7', lsl: '-0.7', data: '1188.6, 1188.5, 1188.4, 1188.7\n1188.5, 1188.8, 1188.5, 1188.6\n1188.4, 1188.3, 1188.6, 1188.5\n1188.7, 1188.6, 1188.5, 1188.4' } },
      { name: 'Final Lock Slot to Flush Cut Distance (Q. E1)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '78', usl: '0.3', lsl: '-0.3', data: '78.1, 78.0, 78.2, 77.9\n78.0, 78.1, 78.1, 78.0\n78.2, 78.1, 78.0, 78.1\n78.0, 77.9, 78.1, 78.2' } },
      { name: 'Middle Lock Slot Width (Q. F4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '14.8', usl: '0.1', lsl: '-0.1', data: '14.82, 14.80, 14.81, 14.79\n14.80, 14.83, 14.80, 14.81\n14.78, 14.80, 14.81, 14.82\n14.80, 14.79, 14.80, 14.81' } },
      { name: 'Middle Lock Slot Height (Q. F4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '8', usl: '0.2', lsl: '-0.2', data: '8.05, 8.10, 8.00, 7.95\n8.02, 8.05, 8.01, 7.99\n8.10, 8.08, 8.05, 8.02\n8.00, 7.98, 8.01, 8.03' } },
      { name: 'Final Lock Slot Width (Q. F2)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '28', usl: '0.2', lsl: '-0.2', data: '28.1, 28.0, 28.2, 27.9\n28.0, 28.1, 28.1, 28.0\n27.9, 28.0, 28.1, 28.2\n28.0, 27.9, 28.0, 28.1' } },
      { name: 'Final Lock Slot Height Location Distance (Q. F2)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '15.1', usl: '0.2', lsl: '-0.2', data: '15.15, 15.10, 15.12, 15.08\n15.11, 15.14, 15.10, 15.13\n15.05, 15.09, 15.10, 15.11\n15.10, 15.12, 15.11, 15.09' } },
      { name: 'Final Lock Slot to Rear Side Distance (Q. F1)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '50', usl: '0.3', lsl: '-0.3', data: '50.1, 50.0, 50.2, 49.9\n50.0, 50.1, 50.1, 50.0\n49.9, 50.0, 50.1, 50.2\n50.0, 49.9, 50.0, 50.1' } },
      { name: 'Distance between Final and Middle Lock Slots (Q. E3)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '377.2', usl: '0.5', lsl: '-0.5', data: '377.3, 377.1, 377.4, 377.0\n377.2, 377.5, 377.1, 377.3\n377.0, 377.2, 377.3, 377.4\n377.1, 377.3, 377.2, 377.0' } },
      { name: 'Machined Slot Width for Carpet Width (Q. E7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '160.9', usl: '0.5', lsl: '-0.5', data: '160.9, 161.0, 160.8, 160.9\n161.0, 161.1, 160.9, 160.8\n160.7, 160.9, 161.0, 161.1\n160.9, 160.8, 160.9, 161.0' } },
      { name: 'Machined Slot for Canister Hole (Q. C7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '36', usl: '0.3', lsl: '-0.3', data: '36.1, 36.0, 36.2, 35.9\n36.0, 36.1, 36.1, 36.0\n35.9, 36.0, 36.1, 36.2\n36.0, 35.9, 36.0, 36.1' } },
      { name: 'Machined Slot for Canister Hole (Q. C6)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '36', usl: '0.3', lsl: '-0.3', data: '36.1, 36.0, 36.2, 35.9\n36.0, 36.1, 36.1, 36.0\n35.9, 36.0, 36.1, 36.2\n36.0, 35.9, 36.0, 36.1' } },
      { name: 'Machined Slot Height for Canister Hole (Q. C7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '16', usl: '0.2', lsl: '-0.2', data: '16.1, 16.0, 16.2, 15.9\n16.0, 16.1, 16.1, 16.0\n15.9, 16.0, 16.1, 16.2\n16.0, 15.9, 16.0, 16.1' } },
      { name: 'Surface Free of Dents, Scratches and/or Metal Shavings', type: 'attribute', initialValues: { subgroupSize: '200', data: '200,2\n200,3\n200,1\n200,4\n200,2\n200,3\n200,2\n200,1\n200,3\n200,2' } },
      { name: 'Channel Validation Tool Sliding', type: 'attribute', initialValues: { subgroupSize: '200', data: '200,0\n200,1\n200,0\n200,0\n200,1\n200,0\n200,0\n200,1\n200,0\n200,0' } }
    ]
  },
  'lid-profile': {
    name: 'Lid Profile HY10 - 142 421',
    characteristics: [
      { name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '1217.5', usl: '0.7', lsl: '-0.7', data: '1217.6, 1217.5, 1217.4, 1217.7\n1217.5, 1217.8, 1217.5, 1217.6\n1217.4, 1217.3, 1217.6, 1217.5' } },
      { name: 'Length from Rear of Lid to LH Hole Center', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '115', usl: '0.3', lsl: '-0.3', data: '115.1, 115.0, 115.2, 114.9\n115.0, 115.1, 115.1, 115.0\n114.9, 115.0, 115.1, 115.2' } },
      { name: 'Length from Rear of Lid to RH Hole Center', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '115', usl: '0.3', lsl: '-0.3', data: '115.1, 115.0, 115.2, 114.9\n115.0, 115.1, 115.1, 115.0\n114.9, 115.0, 115.1, 115.2' } },
      { name: 'Length from Edge to LH Hole', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '10.3', usl: '0.2', lsl: '-0.2', data: '10.35, 10.30, 10.32, 10.28\n10.31, 10.34, 10.30, 10.33\n10.25, 10.29, 10.30, 10.31' } },
      { name: 'Length from Edge to RH Hole', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '10.3', usl: '0.2', lsl: '-0.2', data: '10.35, 10.30, 10.32, 10.28\n10.31, 10.34, 10.30, 10.33\n10.25, 10.29, 10.30, 10.31' } },
      { name: 'LH Hole Internal Diameter', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '7', usl: '0.2', lsl: '-0.2', data: '7.05, 7.10, 7.00, 6.95\n7.02, 7.05, 7.01, 6.99\n7.10, 7.08, 7.05, 7.02' } },
      { name: 'RH Hole Internal Diameter', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '7', usl: '0.2', lsl: '-0.2', data: '7.05, 7.10, 7.00, 6.95\n7.02, 7.05, 7.01, 6.99\n7.10, 7.08, 7.05, 7.02' } },
      { name: 'Surface Free of Scratches, Dents & Evenly Painted/Covered', type: 'attribute', initialValues: { subgroupSize: '150', data: '150,1\n150,2\n150,0\n150,1\n150,1\n150,2\n150,0\n150,1\n150,0\n150,1' } }
    ]
  },
  'front-profile': {
    name: 'Front Profile HY10 - 142 408',
    characteristics: [
      { name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '1324', usl: '0.7', lsl: '-0.7', data: '1324.1, 1324.0, 1323.8, 1324.2\n1324.0, 1324.3, 1324.1, 1323.9\n1323.8, 1324.0, 1324.2, 1324.1' } },
      { name: 'Internal Diameter of LH Side Hole (Q. D7)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.5', usl: '0.5', lsl: '-0.5', data: '9.6, 9.5, 9.7, 9.4\n9.5, 9.6, 9.5, 9.4\n9.7, 9.5, 9.6, 9.4' } },
      { name: 'Internal Diameter of Middle Hole', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.5', usl: '0.5', lsl: '-0.5', data: '9.6, 9.5, 9.7, 9.4\n9.5, 9.6, 9.5, 9.4\n9.7, 9.5, 9.6, 9.4' } },
      { name: 'Internal Diameter of RH Side Hole (Q. E4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.5', usl: '0.5', lsl: '-0.5', data: '9.6, 9.5, 9.7, 9.4\n9.5, 9.6, 9.5, 9.4\n9.7, 9.5, 9.6, 9.4' } },
      { name: 'Length from Edge to RH Hole', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.5', usl: '0.5', lsl: '-0.5', data: '9.6, 9.5, 9.7, 9.4\n9.5, 9.6, 9.5, 9.4\n9.7, 9.5, 9.6, 9.4' } },
      { name: 'Measurement of Processed Cut and Side', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '5', usl: '0.2', lsl: '-0.2', data: '5.1, 5.0, 5.2, 4.9\n5.0, 5.1, 5.1, 5.0\n4.9, 5.0, 5.1, 5.2' } },
      { name: 'Distance between LH Hole Center and Middle Hole Center', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '600', usl: '0.3', lsl: '-0.3', data: '600.1, 600.0, 600.2, 599.9\n600.0, 600.1, 600.1, 600.0\n599.9, 600.0, 600.1, 600.2' } },
      { name: 'Fixture 321 Hole Size/Location Check', type: 'attribute', initialValues: { subgroupSize: '150', data: '150,0\n150,1\n150,0\n150,0\n150,0\n150,1\n150,0\n150,0\n150,1\n150,0' } }
    ]
  },
  'rear-profile': {
    name: 'Rear Profile HY10 - 142 221',
    characteristics: [
      { name: 'Measured Length', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '1157.5', usl: '0.7', lsl: '-0.7', data: '1157.6, 1157.5, 1157.4, 1157.7\n1157.5, 1157.8, 1157.5, 1157.6\n1157.4, 1157.3, 1157.6, 1157.5' } },
      { name: 'Lock Hole in Machined Track to Side of Bottom', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '11.1', usl: '0.25', lsl: '-0.25', data: '11.15, 11.10, 11.20, 11.05\n11.12, 11.15, 11.11, 11.08\n11.10, 11.08, 11.12, 11.14' } },
      { name: 'Internal Diameter of LH Hole (Q. E5)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '13', usl: '0.3', lsl: '-0.3', data: '13.1, 13.0, 13.2, 12.9\n13.0, 13.1, 13.1, 13.0\n12.9, 13.0, 13.1, 13.2' } },
      { name: 'Internal Diameter of RH Hole (Q. E4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '13', usl: '0.3', lsl: '-0.3', data: '13.1, 13.0, 13.2, 12.9\n13.0, 13.1, 13.1, 13.0\n12.9, 13.0, 13.1, 13.2' } },
      { name: 'Distance from Lock Hole to Bottom Side', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '14.11', usl: '0.25', lsl: '-0.25', data: '14.15, 14.10, 14.20, 14.05\n14.12, 14.15, 14.11, 14.08\n14.10, 14.08, 14.12, 14.14' } },
      { name: 'Internal Diameter of Hole (Q. B4)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.6', usl: '0.3', lsl: '-0.3', data: '9.7, 9.6, 9.8, 9.5\n9.6, 9.7, 9.6, 9.5\n9.8, 9.6, 9.7, 9.5' } },
      { name: 'Internal Diameter of Hole (Q. B5)', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '9.6', usl: '0.3', lsl: '-0.3', data: '9.7, 9.6, 9.8, 9.5\n9.6, 9.7, 9.6, 9.5\n9.8, 9.6, 9.7, 9.5' } },
      { name: 'Distance between End of Left Side of Rear Profile to Latch Opening', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '457.2', usl: '0.3', lsl: '-0.3', data: '457.3, 457.1, 457.4, 457.0\n457.2, 457.5, 457.1, 457.3\n457.0, 457.2, 457.3, 457.4' } },
      { name: 'Distance between End of Right Side of Rear Profile to Latch Opening', type: 'variable', initialValues: { subgroupSize: '4', nominalValue: '457.2', usl: '0.3', lsl: '-0.3', data: '457.3, 457.1, 457.4, 457.0\n457.2, 457.5, 457.1, 457.3\n457.0, 457.2, 457.3, 457.4' } },
      { name: 'Surface Free of Dents and Scratches', type: 'attribute', initialValues: { subgroupSize: '150', data: '150,3\n150,2\n150,4\n150,3\n150,2\n150,3\n150,1\n150,4\n150,2\n150,3' } }
    ]
  },
  'pull-force': {
    name: 'Pull Force Test',
    characteristics: [
      {
        name: 'Pull Force Measurement',
        type: 'variable',
        initialValues: { 
          subgroupSize: '5', 
          usl: '2', 
          lsl: '-2', 
          nominalValue: '12', 
          unit: 'Kgf',
          data: '12.1, 11.8, 12.3, 11.9, 12.2\n12.0, 12.4, 11.7, 12.1, 12.0\n11.9, 12.2, 12.1, 11.8, 12.3\n12.2, 12.0, 11.9, 12.1, 12.0\n12.1, 11.9, 12.2, 12.0, 11.8' 
        }
      }
    ]
  }
};

export const partDefinitions: Record<string, PartDefinition> = {
  'axle-profile': {
    name: 'Axle Profile HY10 - 148 253',
    image: PART_IMAGES['axle-profile']!,
    characteristics: [
      { name: 'Length (A)', nominalValue: 150.0, upperTol: 0.5, lowerTol: -0.5, unit: 'mm' },
      { name: 'Diameter (B)', nominalValue: 25.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' },
      { name: 'Surface Roughness', nominalValue: 1.6, upperTol: 0.4, lowerTol: -0.4, unit: 'μm' }
    ]
  },
  'lamella-profile': {
    name: 'Lamella Profile HY10 - 123 257',
    image: PART_IMAGES['lamella-profile']!,
    characteristics: [
      { name: 'Width (C)', nominalValue: 80.0, upperTol: 0.3, lowerTol: -0.3, unit: 'mm' },
      { name: 'Thickness (D)', nominalValue: 12.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' },
      { name: 'Flatness', nominalValue: 0.05, upperTol: 0.02, lowerTol: -0.02, unit: 'mm' }
    ]
  },
  'rh-side-profile': {
    name: 'RH Side Profile HY10 - 142 942',
    image: PART_IMAGES['rh-side-profile']!,
    characteristics: [
      { name: 'Height (E)', nominalValue: 95.0, upperTol: 0.4, lowerTol: -0.4, unit: 'mm' },
      { name: 'Angle (F)', nominalValue: 45.0, upperTol: 1.0, lowerTol: -1.0, unit: '°' }
    ]
  },
  'lh-side-profile': {
    name: 'LH Side Profile HY10 - 142 943',
    image: PART_IMAGES['lh-side-profile']!,
    characteristics: [
      { name: 'Height (G)', nominalValue: 95.0, upperTol: 0.4, lowerTol: -0.4, unit: 'mm' },
      { name: 'Angle (H)', nominalValue: 45.0, upperTol: 1.0, lowerTol: -1.0, unit: '°' }
    ]
  },
  'lid-profile': {
    name: 'Lid Profile HY10 - 142 421',
    image: PART_IMAGES['lid-profile']!,
    characteristics: [
      { name: 'Outer Diameter (I)', nominalValue: 120.0, upperTol: 0.3, lowerTol: -0.3, unit: 'mm' },
      { name: 'Inner Diameter (J)', nominalValue: 110.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' },
      { name: 'Concentricity', nominalValue: 0.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' }
    ]
  },
  'front-profile': {
    name: 'Front Profile HY10 - 142 408',
    image: PART_IMAGES['front-profile']!,
    characteristics: [
      { name: 'Overall Length (K)', nominalValue: 200.0, upperTol: 0.6, lowerTol: -0.6, unit: 'mm' },
      { name: 'Mounting Hole Dia.', nominalValue: 8.0, upperTol: 0.1, lowerTol: -0.1, unit: 'mm' }
    ]
  },
  'rear-profile': {
    name: 'Rear Profile HY10 - 142 221',
    image: PART_IMAGES['rear-profile']!,
    characteristics: [
      { name: 'Overall Width (L)', nominalValue: 180.0, upperTol: 0.5, lowerTol: -0.5, unit: 'mm' },
      { name: 'Step Height (M)', nominalValue: 15.0, upperTol: 0.2, lowerTol: -0.2, unit: 'mm' }
    ]
  },
  'pull-force': {
    name: 'Pull Force Test',
    image: PART_IMAGES['pull-force']!,
    characteristics: [
      { name: 'Pull Force (N)', nominalValue: 12.0, upperTol: 2.0, lowerTol: -2.0, unit: 'Kgf' }
    ]
  }
};
