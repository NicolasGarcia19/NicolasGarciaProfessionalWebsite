// ============================================================================
// PROJECT DATA: edit this file to change everything on the Projects pages.
//
// projects.html builds its grid from this list, and project.html?p=<slug>
// builds each project's page from its entry. Delete an entry to remove a
// project, copy one to add a project. Keep each slug unique, with no spaces.
//
// Every project has:
//   slug      short id used in the page address (project.html?p=project-1)
//   template  'climb'  -> page with a horizontal climb (holds reveal steps)
//             'basic'  -> simpler page (route info, images, pitch tabs)
//   title     project name
//   summary   1-2 sentences shown on the card in the project grid
//   intro     short description shown at the top of the project page
//   image     card image + large image at the top of the page
//   tags      small badges under the description (optional)
//   links     buttons to GitHub, a demo, a report... (optional)
//
// 'climb' projects also have:
//   climbTitle, climbHint   optional heading / helper text over the climb
//   steps: [ { title, text, image?, stat? } ... ]
//     Each step becomes a hold, left to right = start to finish. Hovering or
//     tapping a hold opens its text (and image). Use 3-7 steps; colors run
//     from easy (yellow) to hard (black) automatically.
//     stat is an optional short result, like "12 fps -> 30 fps".
//
// 'basic' projects also have:
//   facts:   [ { label, value } ... ]               "Route info" boxes
//   images:  [ { src, caption } ... ]               1-3 images, click to enlarge
//   routeTitle, routeHint                           optional heading / helper text
//   pitches: [ { title, text } ... ]                tabs along a route; text can be
//                                                   one string or a list of paragraphs
//
// Everything below is placeholder text. Replace it with your own.
// ============================================================================

window.PROJECTS = [
  {
    slug: 'project-1',
    template: 'climb',
    title: 'Project 1',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-1.jpg',
    tags: ['Tag A', 'Tag B', 'Tag C'],
    links: [{ label: 'GitHub', href: 'https://github.com/NicolasGarcia19' }],
    climbHint: 'Each hold is a level of the optimization. Hover over a hold, or tap it, to see how I got there.',
    steps: [
      { title: 'Starting point', text: 'Placeholder: describe the first working version and what its limits were.', image: 'images/projects/project-1-step-1.jpg', stat: 'Metric: before' },
      { title: 'First improvement', text: 'Placeholder: what you changed and why it helped.', image: 'images/projects/project-1-step-2.jpg' },
      { title: 'Second improvement', text: 'Placeholder: the next bottleneck you found and how you removed it.' },
      { title: 'Hardest problem', text: 'Placeholder: the part that took the most debugging, and what you learned.', image: 'images/projects/project-1-step-4.jpg' },
      { title: 'Final result', text: 'Placeholder: where the project ended up and how you measured it.', stat: 'Metric: after' }
    ]
  },
  {
    slug: 'project-2',
    template: 'climb',
    title: 'Project 2',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-2.jpg',
    tags: ['Tag A', 'Tag B'],
    links: [],
    steps: [
      { title: 'Step one', text: 'Placeholder text for the first step.' },
      { title: 'Step two', text: 'Placeholder text for the second step.', image: 'images/projects/project-2-step-2.jpg' },
      { title: 'Step three', text: 'Placeholder text for the third step.' },
      { title: 'Step four', text: 'Placeholder text for the last step.', stat: 'Metric: result' }
    ]
  },
  {
    slug: 'project-3',
    template: 'climb',
    title: 'Project 3',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-3.jpg',
    tags: ['Tag A', 'Tag B', 'Tag C'],
    links: [],
    steps: [
      { title: 'Step one', text: 'Placeholder text.' },
      { title: 'Step two', text: 'Placeholder text.' },
      { title: 'Step three', text: 'Placeholder text.', image: 'images/projects/project-3-step-3.jpg' },
      { title: 'Step four', text: 'Placeholder text.' },
      { title: 'Step five', text: 'Placeholder text.' },
      { title: 'Step six', text: 'Placeholder text.', stat: 'Metric: result' }
    ]
  },
  {
    slug: 'project-4',
    template: 'basic',
    title: 'Project 4',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-4.jpg',
    tags: ['Tag A', 'Tag B'],
    links: [],
    facts: [
      { label: 'Role', value: 'Placeholder' },
      { label: 'Timeline', value: 'Placeholder' },
      { label: 'Team', value: 'Placeholder' },
      { label: 'Tools', value: 'Placeholder' }
    ],
    images: [
      { src: 'images/projects/project-4-a.jpg', caption: 'Placeholder caption for the first image' },
      { src: 'images/projects/project-4-b.jpg', caption: 'Placeholder caption for the second image' }
    ],
    pitches: [
      { title: 'The problem', text: 'Placeholder: what needed solving and why.' },
      { title: 'The approach', text: ['Placeholder: how you tackled it.', 'You can use a list of strings for several paragraphs.'] },
      { title: 'The result', text: 'Placeholder: what you delivered and what you would do next.' }
    ]
  },
  {
    slug: 'project-5',
    template: 'basic',
    title: 'Project 5',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-5.jpg',
    tags: ['Tag A', 'Tag B'],
    links: [],
    facts: [
      { label: 'Role', value: 'Placeholder' },
      { label: 'Timeline', value: 'Placeholder' },
      { label: 'Tools', value: 'Placeholder' }
    ],
    images: [
      { src: 'images/projects/project-5-a.jpg', caption: 'Placeholder caption' }
    ],
    pitches: [
      { title: 'The problem', text: 'Placeholder text.' },
      { title: 'The approach', text: 'Placeholder text.' },
      { title: 'The result', text: 'Placeholder text.' }
    ]
  },
  {
    slug: 'project-6',
    template: 'basic',
    title: 'Project 6',
    summary: 'Placeholder description. One or two sentences about what this project is and why it matters.',
    intro: 'Placeholder short description. Say what you built, who it was for, and what made it hard.',
    image: 'images/projects/project-6.jpg',
    tags: ['Tag A'],
    links: [],
    facts: [
      { label: 'Role', value: 'Placeholder' },
      { label: 'Timeline', value: 'Placeholder' }
    ],
    images: [
      { src: 'images/projects/project-6-a.jpg', caption: 'Placeholder caption' },
      { src: 'images/projects/project-6-b.jpg', caption: 'Placeholder caption' }
    ],
    pitches: [
      { title: 'The problem', text: 'Placeholder text.' },
      { title: 'The approach', text: 'Placeholder text.' },
      { title: 'The result', text: 'Placeholder text.' }
    ]
  }
];
