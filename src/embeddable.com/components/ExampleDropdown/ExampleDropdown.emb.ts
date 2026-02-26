// src/embeddable.com/components/ExampleDropdown/ExampleDropdown.emb.ts
 
import {
    EmbeddedComponentMeta,
    Inputs,
    defineComponent,
    definePreview,
  } from '@embeddable.com/react';
  import { loadData, Value, mockDimension, mockDataResponse } from '@embeddable.com/core';
   
  import Component from './index'; // the React component we've defined above
   
  export const meta = {
    name: 'ExampleDropdown', // this name must match the name of the file (before the `.emb.ts` part)
    label: 'Example Dropdown', // human readable name for the component
    category: 'Examples', // organise your components into categories
    
    // the width and height (in px) that the component will default to when added to the canvas
    defaultWidth: 320, 
    defaultHeight: 50,
   
    // these are the inputs that the user of your component will be able to interact with
    inputs: [
      {
        name: "ds",
        type: "dataset", // this tells Embeddable to render a dropdown with the available datasets
        label: "Dataset to display",
        category: 'Configure chart',
        description: 'The dataset to load the values from'
      },
      {
        name: "values",
        type: "dimension", // this tells Embeddable to render a dropdown with the available dimensions
        label: "Values",
        required: true, // users of your component will be required to provide a value for this input.
        config: {
          dataset: "ds", // this matches the `name` of the input above
        },
        category: 'Configure chart',
        description: 'The choice of values'
      },
      {
        name: 'defaultValue',
        type: 'string', // this tells Embeddable to render a text input 
        label: 'Default value',
        category: 'Configure chart',
        description: 'The initial value'
      },
    ],
    events: [
      {
        // this tells Embeddable that this component can fire an event.  
        // This will mean that users of your component can define an Interaction for it (such as setting a variable).
        name: 'onChange',
        label: 'Change',
        properties: [
          {
            name: 'chosenValue', // tells Embeddable that the event will have a payload of one string, called `chosenValue`
            type: 'string'
          }
        ]
      }]
  } as const satisfies EmbeddedComponentMeta;
   
  export const preview = definePreview(Component, {
      values: mockDimension('country', 'string', { title: 'Country' }),
      results: mockDataResponse(
          ['country'],
          [
              ['US'],
              ['GER'],
              ['UK'],
              ['FRA'],
              ['SPA'],
          ]
      ),
      onChange: () => null,
      defaultValue: ''
  });
   
  // `defineComponent` is what tells Embeddable that this is a component
  export default defineComponent(Component, meta, {
    props: (inputs: Inputs<typeof meta>) => {
      return {
        ...inputs,
        // load data from the database, based on the choice of inputs provided by the user of your component
        // and put the results into a `prop` called `results`
        results: loadData({
          from: inputs.ds, 
          select: [inputs.values] 
        }),
      };
    },
    events: {
      // this takes the `value` passed to `onChange` in the react component, and passes it to `chosenValue` which is defined in the `events` above.
      onChange: (value) => ({ chosenValue: value || Value.noFilter() })
    }
  });